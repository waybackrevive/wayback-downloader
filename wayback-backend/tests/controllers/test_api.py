import pytest
import json
import uuid
import logging
from flask import session
from src.test_config import create_app, db, cogauth, cache, limiter
from src.server import get_conf
from src.controllers.api import login_api
from src.protobuf import response_pb2
from src.lib.cognito_user import CognitoUser
from src.model.orm import *

log = logging.getLogger(__name__)

@pytest.fixture()
def client():
    conf = get_conf("dev")
    connex_app = create_app()
    app = connex_app.app
    with app.test_client() as client:
        with app.app_context():
            app.secret_key = "test"
            app.config["TESTING"] = True
            app.config["SQLALCHEMY_ECHO"] = False
            app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite://"
            app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
            app.config["STRIPE_API_PUBLIC_KEY"] = conf["stripe"]["api_public_key"]
            app.config["STRIPE_API_SECRET_KEY"] = conf["stripe"]["api_secret_key"]
            app.config["STRIPE_ENDPOINT_SECRET"] = conf["stripe"]["endpoint_secret"]
            app.config["STRIPE_DOMAIN"] = conf["stripe"]["domain"]
            app.config["STRIPE_SUBSCRIPTION"] = conf["stripe"]["subscription"]
            app.config["SQS_NAME"] = conf["sqs"]["name"]
            app.config["SQS_REGION"] = conf["sqs"]["region"]
            app.config["COGNITO_REGION"] = "eu-north-1"
            app.config["COGNITO_USERPOOL_ID"] = conf["cognito"]["userpool_id"]
            app.config["COGNITO_APP_CLIENT_ID"] = conf["cognito"]["app_client_id"]
            app.config["COGNITO_APP_CLIENT_SECRET"] = conf["cognito"]["app_client_secret"]
            app.config["COGNITO_CHECK_TOKEN_EXPIRATION"] = True
            app.config["COGNITO_JWT_HEADER_NAME"] = "Authorization"
            app.config["COGNITO_JWT_HEADER_PREFIX"] = "Bearer"
            app.config["RECAPTCHA_HEADER_NAME"] = "Recaptcha"
            app.config["HCAPTCHA_SECRET"] = conf["hcaptcha"]["secret"]
            app.config["HCAPTCHA_SITE_KEY"] = conf["hcaptcha"]["site_key"]
            app.config["CONTACT_EMAIL"] = conf["contact"]["email"]
            app.secret_key = "1120fc9e-ab5e-49cc-a47c-4fcaa615890e"
            db.init_app(app)
            cogauth.init_app(app)
            cache.init_app(app)
            limiter.init_app(app)
            connex_app.add_api("wayback.yaml", options={"swagger_ui": conf["swagger"]["ui"]=="True"})
            db.create_all()
            db.session.add(Status(status="Awaiting Payment"))
            db.session.add(Status(status="Submitted"))
            db.session.add(Status(status="In Progress"))
            db.session.add(Status(status="Done"))
            db.session.add(Client(username="nicolas", email="test@onintime.com", customerId=None, subscriptionId=None))
            db.session.commit()
        yield client

def login_user(client):
    loginForm = response_pb2.LoginForm()
    loginForm.username = "nicolas"
    loginForm.password = "Password;123"
    loginForm.recaptcha = "123"
    return client.post("/api/login", data=loginForm.SerializeToString(), headers={"Content-Type": "application/protobuf"})

def test_login_api_success(client):
    rv = login_user(client)
    assert 200 == rv.status_code

def test_login_api_invalid_password(client):
    loginForm = response_pb2.LoginForm()
    loginForm.username = "nicolas"
    loginForm.password = "Password;1234"
    loginForm.recaptcha = "123"
    rv = client.post("/api/login", data=loginForm.SerializeToString(), headers={"Content-Type": "application/protobuf"})
    assert 422 == rv.status_code

    response = response_pb2.Response()
    response.data.CopyFrom(response_pb2.Data())
    response.error = "The username or password is incorrect"
    response.status = response_pb2.FAILED
    assert response.SerializeToString() == rv.get_data()

def test_login_api_username_blank(client):
    loginForm = response_pb2.LoginForm()
    loginForm.username = ""
    loginForm.password = "Password;123"
    loginForm.recaptcha = "123"
    rv = client.post("/api/login", data=loginForm.SerializeToString(), headers={"Content-Type": "application/protobuf"})
    assert 422 == rv.status_code

    response = response_pb2.Response()
    response.data.CopyFrom(response_pb2.Data())
    response.error = "Invalid body sent"
    response.status = response_pb2.FAILED
    assert response.SerializeToString() == rv.get_data()

def test_login_api_password_blank(client):
    loginForm = response_pb2.LoginForm()
    loginForm.username = "nicolas"
    loginForm.password = ""
    loginForm.recaptcha = "123"
    rv = client.post("/api/login", data=loginForm.SerializeToString(), headers={"Content-Type": "application/protobuf"})
    assert 422 == rv.status_code

    response = response_pb2.Response()
    response.data.CopyFrom(response_pb2.Data())
    response.error = "Invalid body sent"
    response.status = response_pb2.FAILED
    assert response.SerializeToString() == rv.get_data()

# def test_signup_api_success(client):
#     username =  str(uuid.uuid4())
#     signupForm = response_pb2.SignupForm()
#     signupForm.username = username
#     signupForm.password = "Password;123"
#     signupForm.email = "test@test.com"
#     signupForm.recaptcha = "123"
#     rv = client.post("/api/signup", data=signupForm.SerializeToString(), headers={"Content-Type": "application/protobuf"})
#     assert 201 == rv.status_code
#
#     response = response_pb2.Response()
#     data = response_pb2.Data();
#     data.info = "Please confirm your signup, check your email for the validation URL"
#     response.data.CopyFrom(data)
#     response.status = response_pb2.SUCCESS
#     assert response.SerializeToString() == rv.get_data()
#
#     # Confirm user
#     rv = CognitoUser.confirm_signup(username)
#     assert 200 == rv[1]

def test_signup_api_username_blank(client):
    signupForm = response_pb2.SignupForm()
    signupForm.username = ""
    signupForm.password = "Password;123"
    signupForm.email = "test@test.com"
    signupForm.recaptcha = "123"
    rv = client.post("/api/signup", data=signupForm.SerializeToString(), headers={"Content-Type": "application/json"})
    assert 422 == rv.status_code

    response = response_pb2.Response()
    response.data.CopyFrom(response_pb2.Data())
    response.error = "Invalid body sent"
    response.status = response_pb2.FAILED
    assert response.SerializeToString() == rv.get_data()

def test_signup_api_email_blank(client):
    signupForm = response_pb2.SignupForm()
    signupForm.username = "test"
    signupForm.password = "Password;123"
    signupForm.email = ""
    signupForm.recaptcha = "123"
    rv = client.post("/api/signup", data=signupForm.SerializeToString(), headers={"Content-Type": "application/json"})
    assert 422 == rv.status_code

    response = response_pb2.Response()
    response.data.CopyFrom(response_pb2.Data())
    response.error = "Invalid body sent"
    response.status = response_pb2.FAILED
    assert response.SerializeToString() == rv.get_data()

def test_signup_api_password_blank(client):
    signupForm = response_pb2.SignupForm()
    signupForm.username = "test"
    signupForm.password = ""
    signupForm.email = "test@test.com"
    signupForm.recaptcha = "123"
    rv = client.post("/api/signup", data=signupForm.SerializeToString(), headers={"Content-Type": "application/json"})
    assert 422 == rv.status_code

    response = response_pb2.Response()
    response.data.CopyFrom(response_pb2.Data())
    response.error = "Invalid body sent"
    response.status = response_pb2.FAILED
    assert response.SerializeToString() == rv.get_data()

def test_forgot_password_api_success(client):
    forgotPasswordForm = response_pb2.ForgotPasswordForm()
    forgotPasswordForm.username = "nicolas"
    forgotPasswordForm.recaptcha = "123"
    rv = client.post("/api/forgot-password", data=forgotPasswordForm.SerializeToString(), headers={"Content-Type": "application/protobuf"})
    assert 200 == rv.status_code

    response = response_pb2.Response()
    data = response_pb2.Data()
    data.info = "Successfully sent reset token. Please verify your emails."
    response.data.CopyFrom(data)
    response.status = response_pb2.SUCCESS
    assert response.SerializeToString() == rv.get_data()

def test_forgot_password_username_blank(client):
    forgotPasswordForm = response_pb2.ForgotPasswordForm()
    forgotPasswordForm.username = ""
    forgotPasswordForm.recaptcha = "123"
    rv = client.post("/api/forgot-password", data=forgotPasswordForm.SerializeToString(), headers={"Content-Type": "application/protobuf"})
    assert 422 == rv.status_code

    response = response_pb2.Response()
    response.data.CopyFrom(response_pb2.Data())
    response.status = response_pb2.FAILED
    response.error = "Invalid body sent"
    assert response.SerializeToString() == rv.get_data()

def test_forgot_password_confirm_api_wrong_code(client):
    forgotPasswordConfirmForm = response_pb2.ForgotPasswordConfirmForm()
    forgotPasswordConfirmForm.username = "nicolas"
    forgotPasswordConfirmForm.token = "123"
    forgotPasswordConfirmForm.password = "Password;123"
    forgotPasswordConfirmForm.recaptcha = "123"
    rv = client.post("/api/forgot-password-confirm", data=forgotPasswordConfirmForm.SerializeToString(), headers={"Content-Type": "application/protobuf"})
    assert 400 == rv.status_code

    response = response_pb2.Response()
    response.data.CopyFrom(response_pb2.Data())
    response.status = response_pb2.FAILED
    response.error = "An error occurred (ExpiredCodeException) when calling the ConfirmForgotPassword operation: Invalid code provided, please request a code again."
    assert response.SerializeToString() == rv.get_data()

def test_forgot_password_confirm_api_username_blank(client):
    forgotPasswordConfirmForm = response_pb2.ForgotPasswordConfirmForm()
    forgotPasswordConfirmForm.username = ""
    forgotPasswordConfirmForm.token = "123"
    forgotPasswordConfirmForm.password = "Password;123"
    forgotPasswordConfirmForm.recaptcha = "123"
    rv = client.post("/api/forgot-password-confirm", data=forgotPasswordConfirmForm.SerializeToString(), headers={"Content-Type": "application/protobuf"})
    assert 422 == rv.status_code

    response = response_pb2.Response()
    response.data.CopyFrom(response_pb2.Data())
    response.status = response_pb2.FAILED
    response.error = "Invalid body sent"
    assert response.SerializeToString() == rv.get_data()

def test_forgot_password_confirm_api_token_blank(client):
    forgotPasswordConfirmForm = response_pb2.ForgotPasswordConfirmForm()
    forgotPasswordConfirmForm.username = "nicolas"
    forgotPasswordConfirmForm.token = ""
    forgotPasswordConfirmForm.password = "Password;123"
    forgotPasswordConfirmForm.recaptcha = "123"
    rv = client.post("/api/forgot-password-confirm", data=forgotPasswordConfirmForm.SerializeToString(), headers={"Content-Type": "application/protobuf"})
    assert 422 == rv.status_code

    response = response_pb2.Response()
    response.data.CopyFrom(response_pb2.Data())
    response.status = response_pb2.FAILED
    response.error = "Invalid body sent"
    assert response.SerializeToString() == rv.get_data()

def test_forgot_password_confirm_api_password_blank(client):
    forgotPasswordConfirmForm = response_pb2.ForgotPasswordConfirmForm()
    forgotPasswordConfirmForm.username = "nicolas"
    forgotPasswordConfirmForm.token = "123"
    forgotPasswordConfirmForm.password = ""
    forgotPasswordConfirmForm.recaptcha = "123"
    rv = client.post("/api/forgot-password-confirm", data=forgotPasswordConfirmForm.SerializeToString(), headers={"Content-Type": "application/protobuf"})
    assert 422 == rv.status_code

    response = response_pb2.Response()
    response.data.CopyFrom(response_pb2.Data())
    response.status = response_pb2.FAILED
    response.error = "Invalid body sent"
    assert response.SerializeToString() == rv.get_data()

def test_contact_api_success(client):
    contactForm = response_pb2.ContactForm()
    contactForm.name = "John"
    contactForm.email = "test@test.com"
    contactForm.message = "test"
    contactForm.recaptcha = "test"
    rv = client.post("/api/contact", data=contactForm.SerializeToString(), headers={"Content-Type": "application/protobuf"})
    assert 200 == rv.status_code

    response = response_pb2.Response()
    response.data.CopyFrom(response_pb2.Data())
    response.status = response_pb2.SUCCESS
    assert response.SerializeToString() == rv.get_data()

def test_contact_api_name_blank(client):
    contactForm = response_pb2.ContactForm()
    contactForm.name = ""
    contactForm.email = "test@test.com"
    contactForm.message = "test"
    contactForm.recaptcha = "test"
    rv = client.post("/api/contact", data=contactForm.SerializeToString(), headers={"Content-Type": "application/protobuf"})
    assert 422 == rv.status_code

    response = response_pb2.Response()
    response.data.CopyFrom(response_pb2.Data())
    response.status = response_pb2.FAILED
    response.error = "Invalid body sent"
    assert response.SerializeToString() == rv.get_data()

def test_contact_api_email_blank(client):
    contactForm = response_pb2.ContactForm()
    contactForm.name = "John"
    contactForm.email = ""
    contactForm.message = "test"
    contactForm.recaptcha = "test"
    rv = client.post("/api/contact", data=contactForm.SerializeToString(), headers={"Content-Type": "application/protobuf"})
    assert 422 == rv.status_code

    response = response_pb2.Response()
    response.data.CopyFrom(response_pb2.Data())
    response.status = response_pb2.FAILED
    response.error = "Invalid body sent"
    assert response.SerializeToString() == rv.get_data()

def test_contact_api_message_blank(client):
    contactForm = response_pb2.ContactForm()
    contactForm.name = "John"
    contactForm.email = "test@test.com"
    contactForm.message = ""
    contactForm.recaptcha = "test"
    rv = client.post("/api/contact", data=contactForm.SerializeToString(), headers={"Content-Type": "application/protobuf"})
    assert 422 == rv.status_code

    response = response_pb2.Response()
    response.data.CopyFrom(response_pb2.Data())
    response.status = response_pb2.FAILED
    response.error = "Invalid body sent"
    assert response.SerializeToString() == rv.get_data()

def test_process_api_not_logged_in(client):
    cartItem = response_pb2.CartItem()
    cartItem.domain = "onintime.com"
    cartItem.timestamp = "20190607023527"
    rv = client.post("/api/process", data=cartItem.SerializeToString(), headers={"Content-Type": "application/protobuf"})
    assert 401 == rv.status_code

def test_process_api_not_subscribed(client):
    # Login
    rv = login_user(client)
    assert 200 == rv.status_code

    resp = response_pb2.Response()
    resp.ParseFromString(rv.get_data())

    cartItem = response_pb2.CartItem()
    cartItem.domain = "onintime.com"
    cartItem.timestamp = "20190607023527"
    rv = client.post("/api/process", data=cartItem.SerializeToString(), headers={"Content-Type": "application/protobuf", "Authorization":"Bearer " + resp.data.user.token})
    assert 422 == rv.status_code

    response = response_pb2.Response()
    response.data.CopyFrom(response_pb2.Data())
    response.status = response_pb2.FAILED
    response.error = "You are not subscribed"
    assert response.SerializeToString() == rv.get_data()

def test_webhook_api_no_body(client):
    rv = client.post("/api/webhook", headers={"Content-Type": "application/json"})
    assert 400 == rv.status_code
    assert {"data": {}, "error": "Unable to extract timestamp and signatures from header", "status": "failure"} == rv.get_json()

def test_webhook_api_invalid_signature(client):
    rv = client.post("/api/webhook", headers={"Content-Type": "application/json", "Stripe-Signature": "123"})
    assert 400 == rv.status_code
    assert {"data": {}, "error": "Unable to extract timestamp and signatures from header", "status": "failure"} == rv.get_json()

def test_customer_portal_api_not_logged_in(client):
    rv = client.post("/api/customer-portal", headers={"Content-Type": "application/json"})
    assert 401 == rv.status_code

def test_customer_portal_api_success(client):
    # Login
    rv = login_user(client)
    assert 200 == rv.status_code

    resp = response_pb2.Response()
    resp.ParseFromString(rv.get_data())

    rv = client.post("/api/customer-portal", headers={"Authorization": "Bearer " + resp.data.user.token, "Content-Type": "application/protobuf"})
    assert rv.status_code == 422

    response = response_pb2.Response()
    response.data.CopyFrom(response_pb2.Data())
    response.status = response_pb2.FAILED
    response.error = "Client is not subscribed"
    assert response.SerializeToString() == rv.get_data()

def test_checkout_api_success(client):
    # Login
    rv = login_user(client)
    assert 200 == rv.status_code

    cartItem = response_pb2.CartItem()
    cartItem.domain = "onintime.com"
    cartItem.timestamp = "20190126065935"

    cart = response_pb2.Cart()
    cart.items.append(cartItem)

    rv = client.post("/api/checkout", data=cart.SerializeToString(), headers={"Content-Type": "application/protobuf"})
    assert 200 == rv.status_code

def test_checkout_api_empty_cart(client):
    # Login
    rv = login_user(client)
    assert 200 == rv.status_code

    cart = response_pb2.Cart()
    rv = client.post("/api/checkout", data=cart.SerializeToString(), headers={"Content-Type": "application/protobuf"})
    assert 422 == rv.status_code

    response = response_pb2.Response()
    response.data.CopyFrom(response_pb2.Data())
    response.status = response_pb2.FAILED
    response.error = "Cart is empty"
    assert response.SerializeToString() == rv.get_data()
