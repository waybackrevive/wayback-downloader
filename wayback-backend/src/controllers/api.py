#!/usr/bin/env python3
"""This module serves the api for Wayback Download"""

import hmac
import hashlib
import json
import logging
import re
import threading
from datetime import datetime
from http import HTTPStatus
from time import time
from uuid import uuid4

import boto3
import requests
import validators
from flask import g, current_app, request
from sqlalchemy import and_

from src.config import db
from src.lib.flask_cognito import cognito_auth_header_required_api, cognito_auth_header_optional_api
from src.lib.cognito_user import CognitoUser
from src.lib.response import HttpResponse, ProtobufResponse
from src.lib.common import load_page, get_client, get_whop_subscription_status, send_message, get_client_admin_status
from src.model.orm import WhopPayment, WhopSession, Restore, Receipt, Client, Status
from src.protobuf import response_pb2

log = logging.getLogger(__name__)

"""
User Endpoints
"""


def login_api(body):
    """Handle login event"""
    form = response_pb2.LoginForm()
    form.ParseFromString(body)
    if form.IsInitialized() and form.username != "" and form.password != "":
        if CognitoUser.validate_recaptcha(form.recaptcha) or current_app.config.get("TESTING"):
            return CognitoUser.initiate_auth(form.username, form.password)
        else:
            return ProtobufResponse().failure(status=HTTPStatus.UNPROCESSABLE_ENTITY,
                                              error="Unable to validate recaptcha")
    else:
        return ProtobufResponse().failure(HTTPStatus.UNPROCESSABLE_ENTITY, error="Invalid body sent")


def signup_api(body):
    """Handle signup event"""
    form = response_pb2.SignupForm()
    form.ParseFromString(body)
    if form.IsInitialized() and form.username != "" and form.password != "" and form.email != "":
        if CognitoUser.validate_recaptcha(form.recaptcha) or current_app.config.get("TESTING"):
            return CognitoUser.create_cognito_user(form.username, form.password, form.email)
        else:
            return ProtobufResponse().failure(status=HTTPStatus.UNPROCESSABLE_ENTITY,
                                              error="Unable to validate recaptcha")
    else:
        return ProtobufResponse().failure(HTTPStatus.UNPROCESSABLE_ENTITY, error="Invalid body sent")


def forgot_password_api(body):
    """Handle forgot password event"""
    form = response_pb2.ForgotPasswordForm()
    form.ParseFromString(body)
    if form.IsInitialized() and form.username != "":
        if CognitoUser.validate_recaptcha(form.recaptcha) or current_app.config.get("TESTING"):
            return CognitoUser.forgot_password(form.username)
        else:
            return ProtobufResponse().failure(status=HTTPStatus.UNPROCESSABLE_ENTITY,
                                              error="Unable to validate recaptcha")
    else:
        return ProtobufResponse().failure(HTTPStatus.UNPROCESSABLE_ENTITY, error="Invalid body sent")


def forgot_password_confirm_api(body):
    """Handle forgot password confirmed event"""
    form = response_pb2.ForgotPasswordConfirmForm()
    form.ParseFromString(body)
    if form.IsInitialized() and form.username != "" and form.password != "" and form.token != "":
        if CognitoUser.validate_recaptcha(form.recaptcha) or current_app.config.get("TESTING"):
            return CognitoUser.confirm_forgot_password(form.username, form.token, form.password)
        else:
            return ProtobufResponse().failure(status=HTTPStatus.UNPROCESSABLE_ENTITY,
                                              error="Unable to validate recaptcha")
    else:
        return ProtobufResponse().failure(HTTPStatus.UNPROCESSABLE_ENTITY, error="Invalid body sent")


def contact_api(body):
    """Handle contact message event"""
    form = response_pb2.ContactForm()
    form.ParseFromString(body)
    if form.IsInitialized() and form.name != "" and form.message != "" and form.email != "":
        if not validators.email(form.email):
            return ProtobufResponse().failure(status=HTTPStatus.UNPROCESSABLE_ENTITY,
                                              error="Invalid email address")
        elif CognitoUser.validate_recaptcha(form.recaptcha) or current_app.config.get("TESTING"):
            send_email("[Contact Form] - %s" % (form.name), form.message,
                       current_app.config.get("CONTACT_EMAIL"), reply_to=form.email)
            return ProtobufResponse().success(status=HTTPStatus.OK)
        else:
            return ProtobufResponse().failure(status=HTTPStatus.UNPROCESSABLE_ENTITY,
                                              error="Unable to validate recaptcha")
    else:
        return ProtobufResponse().failure(HTTPStatus.UNPROCESSABLE_ENTITY, error="Invalid body sent")


def send_email(subject, body, recipient, html=None, type="text",
               reply_to="Wayback Download Support <support@wayback.download>"):
    """Send email to user for order information using SES"""
    try:
        client = boto3.client("ses", region_name=current_app.config.get("SES_REGION", "eu-north-1"))
        message = {"Subject": {"Data": subject}, "Body": {"Text": {"Data": body}}}
        if type == "html":
            message["Body"] = {"Text": {"Data": body}, "Html": {"Data": html}}

        t = threading.Thread(target=client.send_email,
                             kwargs={"Source": "Wayback Download Support <support@wayback.download>",
                                     "Destination": {"ToAddresses": [recipient]}, "Message": message,
                                     "ReplyToAddresses": [reply_to]})
        t.start()
    except Exception as exception:
        log.error("Unable to send email to %s: %s", recipient, exception)
        return False


"""
Cart Endpoints
"""


def validate_cart(domain, timestamp):
    if not validators.domain(domain):
        return ProtobufResponse().failure(HTTPStatus.UNPROCESSABLE_ENTITY,
                                          error="%s is not a valid domain" % (domain))
    if not re.match(r"[0-9]{14}", timestamp):
        return ProtobufResponse().failure(HTTPStatus.UNPROCESSABLE_ENTITY,
                                          error="%s is not a valid timestamp for %s" % (timestamp, domain))


"""
Whop Endpoints
"""


def _whop_headers():
    """Return Whop API auth headers"""
    return {
        "Authorization": "Bearer %s" % current_app.config.get("WHOP_API_KEY"),
        "Content-Type": "application/json"
    }


def _verify_whop_signature(payload_bytes, sig_header, secret):
    """Verify Whop webhook HMAC-SHA256 signature"""
    try:
        expected = "sha256=" + hmac.new(
            secret.encode("utf-8"), payload_bytes, hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(sig_header, expected)
    except Exception:
        return False


@cognito_auth_header_required_api
def process_api(body):
    """Process restore for a subscriber (no new payment required)"""
    username = g.cogauth_username
    client = Client.query.get(username)

    cart = response_pb2.CartItem()
    cart.ParseFromString(body)
    if cart.IsInitialized():
        resp = validate_cart(cart.domain, cart.timestamp)
        if resp is not None:
            return resp
    else:
        return ProtobufResponse().failure(HTTPStatus.BAD_REQUEST, error="Invalid body, must provide a list")

    if client.whopMembershipId is None:
        return ProtobufResponse().failure(HTTPStatus.UNPROCESSABLE_ENTITY, error="You are not subscribed")

    try:
        resp = requests.get(
            "https://api.whop.com/api/v5/memberships/%s" % client.whopMembershipId,
            headers={"Authorization": "Bearer %s" % current_app.config.get("WHOP_API_KEY")},
            timeout=10
        )
        membership = resp.json()
    except Exception as exception:
        log.error("Unable to fetch Whop membership: %s", exception)
        return ProtobufResponse().failure(HTTPStatus.BAD_REQUEST, error="Unable to verify subscription")

    if not membership.get("valid") or membership.get("status") != "active":
        return ProtobufResponse().failure(HTTPStatus.UNPROCESSABLE_ENTITY, error="Subscription is not active")

    period_start = membership.get("renewal_period_start", 0)
    period_end = membership.get("renewal_period_end", 0)
    restores = Restore.query.filter(
        and_(Restore.username == username,
             Restore.transactDate >= period_start, Restore.transactDate < period_end)
    ).all()
    if len(restores) >= 10:
        return ProtobufResponse().failure(HTTPStatus.UNPROCESSABLE_ENTITY,
                                          error="You have reached the maximum number of restores for this billing period")

    session = WhopSession.query.filter(WhopSession.subscription == client.whopMembershipId).first()
    if session is None:
        log.error("No WhopSession found for membership %s", client.whopMembershipId)
        return ProtobufResponse().failure(HTTPStatus.INTERNAL_SERVER_ERROR,
                                          error="Subscription session not found, please contact support")
    restore = Restore(id=str(uuid4()), domain=cart.domain, timestamp=cart.timestamp,
                      sessionId=session.sessionId, username=username,
                      statusId=2, transactDate=int(time()))
    db.session.add(restore)
    db.session.commit()
    send_message(json.dumps(client.to_dict()), domain=cart.domain,
                 timestamp=cart.timestamp, id=restore.id, action="restore", method="main")
    send_email("Your order is in progress!", "Your order is in progress! We have received your order.",
               client.email,
               html=load_page("receipt_with_subscription",
                              items=[{"domain": cart.domain, "timestamp": cart.timestamp}]), type="html")
    return ProtobufResponse().success(HTTPStatus.OK,
                                      info="Processing transaction for: %s (%s)" % (cart.domain, cart.timestamp))


@cognito_auth_header_optional_api
def checkout_api(body):
    """Create a Whop checkout link for one-time restore purchase ($19 first domain, $12 each additional)"""
    username = g.cogauth_username
    client = get_client(username) if username else None

    cart = response_pb2.Cart()
    cart.ParseFromString(body)
    if not cart.IsInitialized() or len(cart.items) == 0:
        return ProtobufResponse().failure(HTTPStatus.UNPROCESSABLE_ENTITY, error="Cart is empty")

    for item in cart.items:
        resp = validate_cart(item.domain, item.timestamp)
        if resp is not None:
            return resp

    session_id = str(uuid4())
    n = len(cart.items)
    total_price = 19.00 + (n - 1) * 12.00 if n > 1 else 19.00
    items_meta = [{"domain": i.domain, "timestamp": i.timestamp} for i in cart.items]
    redirect_url = ("%s/dashboard" % current_app.config.get("APP_DOMAIN")
                    if client else "%s/success/%s" % (current_app.config.get("APP_DOMAIN"), session_id))

    try:
        whop_resp = requests.post(
            "https://api.whop.com/api/v5/checkout/links",
            headers=_whop_headers(),
            json={
                "plan_id": current_app.config.get("WHOP_SINGLE_PLAN_ID"),
                "initial_price": total_price,
                "metadata": {"session_id": session_id, "username": username or "", "items": items_meta},
                "redirect_url": redirect_url
            },
            timeout=30
        )
        whop_resp.raise_for_status()
        checkout_data = whop_resp.json()
    except Exception as exception:
        log.error("Unable to create Whop checkout: %s", exception)
        return ProtobufResponse().failure(HTTPStatus.BAD_REQUEST, error="Unable to create checkout")

    add_websites(cart, username, session_id)
    add_whop_session(session_id, checkout_data["id"], username)
    return ProtobufResponse().success(HTTPStatus.OK, url=checkout_data["url"])


@cognito_auth_header_required_api
def subscription_checkout_session_api():
    """Create a Whop checkout link for subscription purchase ($95/mo)"""
    username = g.cogauth_username
    session_id = str(uuid4())
    redirect_url = "%s/subscription" % current_app.config.get("APP_DOMAIN")

    try:
        whop_resp = requests.post(
            "https://api.whop.com/api/v5/checkout/links",
            headers=_whop_headers(),
            json={
                "plan_id": current_app.config.get("WHOP_SUBSCRIPTION_PLAN_ID"),
                "metadata": {"session_id": session_id, "username": username},
                "redirect_url": redirect_url
            },
            timeout=30
        )
        whop_resp.raise_for_status()
        checkout_data = whop_resp.json()
    except Exception as exception:
        log.error("Unable to create Whop subscription checkout: %s", exception)
        return ProtobufResponse().failure(HTTPStatus.BAD_REQUEST, error=str(exception))

    add_whop_session(session_id, checkout_data["id"], username)
    return ProtobufResponse().success(HTTPStatus.OK, url=checkout_data["url"])


@cognito_auth_header_required_api
def customer_portal_api():
    """Return the Whop user hub URL for managing subscriptions"""
    client = get_client(g.cogauth_username)
    if client.whopMembershipId is None:
        return ProtobufResponse().failure(HTTPStatus.UNPROCESSABLE_ENTITY, error="Client is not subscribed")
    return ProtobufResponse().success(HTTPStatus.OK, url="https://whop.com/hub")


def webhook_api():
    """Handle incoming Whop webhook events"""
    sig_header = request.headers.get("Whop-Signature", None)
    payload = request.data

    if sig_header is None or not _verify_whop_signature(
            payload, sig_header, current_app.config.get("WHOP_WEBHOOK_SECRET", "")):
        log.error("Invalid Whop webhook signature")
        return HttpResponse().failure(HTTPStatus.BAD_REQUEST, error="Invalid webhook signature")

    try:
        event = json.loads(payload.decode("utf-8"))
    except ValueError as exception:
        return HttpResponse().failure(HTTPStatus.BAD_REQUEST, error=str(exception))

    action = event.get("action")
    data = event.get("data", {})

    if action == "membership.went_valid":
        _membership_went_valid(data)
    elif action == "payment.succeeded":
        _payment_succeeded(data)
    else:
        log.warning("Unhandled Whop event: %s", action)

    return HttpResponse().success(HTTPStatus.OK)


def _membership_went_valid(data):
    """Handle Whop membership.went_valid — membership is now active"""
    checkout_id = data.get("checkout_id")
    membership_id = data.get("id")
    user_id = data.get("user_id")
    plan_id = data.get("plan_id")
    metadata = data.get("metadata") or {}
    if isinstance(metadata, str):
        try:
            metadata = json.loads(metadata)
        except Exception:
            metadata = {}

    session_id = metadata.get("session_id")
    username = metadata.get("username") or None
    if username == "":
        username = None

    is_subscription = plan_id == current_app.config.get("WHOP_SUBSCRIPTION_PLAN_ID")

    whop_session = (get_whop_session_by_checkout(checkout_id) if checkout_id
                    else get_whop_session(session_id))
    if whop_session is None and session_id:
        whop_session = get_whop_session(session_id)
    if whop_session is None:
        log.error("No WhopSession found for checkout_id=%s session_id=%s", checkout_id, session_id)
        return

    # Persist Whop user/membership IDs on the client
    if username:
        client = get_client(username)
        if client:
            if client.whopUserId != user_id:
                client.whopUserId = user_id
            if is_subscription and client.whopMembershipId != membership_id:
                client.whopMembershipId = membership_id
            db.session.commit()

    if is_subscription:
        update_whop_session(whop_session.sessionId, subscription=membership_id)

    # If payment already recorded, process order
    whop_payment = get_whop_payment_by_session(whop_session.sessionId)
    if whop_payment is not None:
        process_order(whop_session, whop_payment)


def _payment_succeeded(data):
    """Handle Whop payment.succeeded — payment details available"""
    payment_id = data.get("id")
    checkout_id = data.get("checkout_id")
    amount = str(data.get("amount", 0) / 100.0)
    email = data.get("email", "")
    receipt_url = data.get("receipt_url", "")

    add_whop_payment(payment_id, amount, receipt_url, email)

    # Look up session to find whether membership event already arrived
    whop_session = get_whop_session_by_checkout(checkout_id) if checkout_id else None
    if whop_session is not None:
        update_whop_session(whop_session.sessionId, payment_id=payment_id)
        process_order(whop_session, get_whop_payment(payment_id))


def process_order(whopSession, whopPayment):
    """Dispatch restore jobs and send receipt emails after payment confirmed"""
    if whopSession.username is not None:
        client = get_client(whopSession.username)
    else:
        client = Client(email=whopPayment.receiptEmail)

    if whopSession.subscription is None:
        # One-time purchase — dispatch each restore item to SQS
        restores = Restore.query.filter_by(sessionId=whopSession.sessionId).all()
        for item in restores:
            send_message(json.dumps(client.to_dict()), domain=item.domain,
                         timestamp=item.timestamp, id=item.id, action="restore", method="main")
            item.statusId = 2
        db.session.commit()
        send_email("Thank you for your purchase!",
                   "Your order is being processed. We will notify you when it is ready.",
                   client.email,
                   html=load_page("receipt_nosubscription", items=restores,
                                  receiptUrl=whopPayment.receiptUrl), type="html")
    else:
        # Subscription activation
        send_email("Thank you for subscribing!",
                   "You can now restore up to 10 websites a month from the order page.",
                   client.email,
                   html=load_page("receipt_subscribe", receiptUrl=whopPayment.receiptUrl), type="html")

    db.session.add(Receipt(id=str(uuid4()), sessionId=whopSession.sessionId,
                           url=whopPayment.receiptUrl or "",
                           username=whopSession.username,
                           amount=whopPayment.amount, date=datetime.now()))
    db.session.commit()


@cognito_auth_header_required_api
def receipt_api():
    return ProtobufResponse().success(HTTPStatus.OK, receipts=Receipt.query.filter(
        Receipt.username == g.cogauth_username).all())


@cognito_auth_header_required_api
def restore_api():
    return ProtobufResponse().success(HTTPStatus.OK, restores=Restore.query.join(Status)
                                      .join(Client, Client.username == Restore.username)
                                      .filter(and_(Restore.username == g.cogauth_username,
                                                   Status.id != 1))
                                      .add_columns(Client.email)
                                      .all())


def restore_by_session_api(sessionId):
    return ProtobufResponse().success(HTTPStatus.OK, restores=Restore.query
                                      .join(WhopSession, WhopSession.sessionId == Restore.sessionId)
                                      .join(WhopPayment, WhopSession.paymentId == WhopPayment.paymentId)
                                      .filter(Restore.sessionId == WhopSession.sessionId)
                                      .filter(WhopSession.paymentId == WhopPayment.paymentId)
                                      .add_columns(WhopPayment.receiptEmail)
                                      .filter(Restore.sessionId == sessionId).all())


@cognito_auth_header_required_api
def user_api():
    return ProtobufResponse().success(HTTPStatus.OK, user={
        "is_subscribed": get_whop_subscription_status(g.cogauth_username),
        "id_token": "", "is_admin": get_client_admin_status()})


def add_websites(cart, username, sessionId):
    """Add website restore to db"""
    try:
        for item in cart.items:
            db.session.add(Restore(id=str(uuid4()), domain=item.domain, timestamp=item.timestamp,
                                   username=username, sessionId=sessionId, statusId=1, transactDate=int(time())))
        db.session.commit()
    except Exception as exception:
        log.error("Unable to add websites: %s", exception)


def add_whop_session(sessionId, checkoutId, username):
    """Add Whop session to db"""
    try:
        db.session.add(WhopSession(sessionId=sessionId, checkoutId=checkoutId, username=username))
        db.session.commit()
    except Exception as exception:
        log.error("Unable to add WhopSession (%s) for %s: %s", sessionId, username, exception)


def get_whop_session(sessionId):
    """Get WhopSession by internal session ID"""
    try:
        return WhopSession.query.get(sessionId)
    except Exception as exception:
        log.error("Unable to get WhopSession (%s): %s", sessionId, exception)
        return None


def get_whop_session_by_checkout(checkoutId):
    """Get WhopSession by Whop checkout link ID"""
    return WhopSession.query.filter(WhopSession.checkoutId == checkoutId).first()


def update_whop_session(sessionId, payment_id=None, subscription=None):
    """Update WhopSession fields after webhook"""
    try:
        item = WhopSession.query.get(sessionId)
        if payment_id is not None:
            item.paymentId = payment_id
        if subscription is not None:
            item.subscription = subscription
        db.session.commit()
    except Exception as exception:
        log.error("Unable to update WhopSession (%s): %s", sessionId, exception)


def add_whop_payment(paymentId, amount, receiptUrl, receiptEmail):
    """Add WhopPayment to db"""
    try:
        db.session.add(WhopPayment(paymentId=paymentId,
                                   amount=amount, receiptUrl=receiptUrl, receiptEmail=receiptEmail))
        db.session.commit()
    except Exception as exception:
        log.error("Unable to add WhopPayment (%s): %s", paymentId, exception)


def get_whop_payment(paymentId):
    """Get WhopPayment by ID"""
    try:
        return WhopPayment.query.get(paymentId)
    except Exception as exception:
        log.error("Unable to get WhopPayment (%s): %s", paymentId, exception)
        return None


def get_whop_payment_by_session(sessionId):
    """Get WhopPayment via its linked WhopSession"""
    try:
        session = WhopSession.query.get(sessionId)
        if session and session.paymentId:
            return WhopPayment.query.get(session.paymentId)
        return None
    except Exception as exception:
        log.error("Unable to get WhopPayment for session (%s): %s", sessionId, exception)
        return None
