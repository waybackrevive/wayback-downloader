#!/usr/bin/env python3
"""This module serves the admin api for Wayback Download"""

import logging
import json
from http import HTTPStatus
from src.config import db
from src.lib.flask_cognito import cognito_auth_header_required_api
from src.lib.response import ProtobufResponse
from src.lib.common import load_page, get_client, get_whop_subscription_status, send_message, admin_required
from src.model.orm import WhopPayment, WhopSession, Restore, Receipt, Client, Status
from src.protobuf import response_pb2

log = logging.getLogger(__name__)


@cognito_auth_header_required_api
@admin_required
def restores():
    return ProtobufResponse().success(HTTPStatus.OK, restores=Restore.query
                                      .join(WhopSession, WhopSession.sessionId == Restore.sessionId)
                                      .join(WhopPayment, WhopSession.paymentId == WhopPayment.paymentId)
                                      .filter(Restore.sessionId == WhopSession.sessionId)
                                      .filter(WhopSession.paymentId == WhopPayment.paymentId)
                                      .add_columns(WhopPayment.receiptEmail)
                                      .all())


@cognito_auth_header_required_api
@admin_required
def restore_id(id):
    return ProtobufResponse().success(HTTPStatus.OK, restore=Restore.query
                                      .join(WhopSession, WhopSession.sessionId == Restore.sessionId)
                                      .join(WhopPayment, WhopSession.paymentId == WhopPayment.paymentId)
                                      .filter(Restore.sessionId == WhopSession.sessionId)
                                      .filter(WhopSession.paymentId == WhopPayment.paymentId)
                                      .add_columns(WhopPayment.receiptEmail)
                                      .filter(Restore.id == id)
                                      .first())


@cognito_auth_header_required_api
@admin_required
def update_restore(body):
    form = response_pb2.Restore()
    form.ParseFromString(body)

    if form.IsInitialized() and form.id != "" and form.email != "" and form.domain != "" and form.timestamp != "" and form.status != "":
        try:
            restore = Restore.query.get(form.id)
            status = Status.query.filter(Status.status == form.status).first()
            if form.s3Url != "":
                restore.s3Url = form.s3Url
            restore.timestamp = form.timestamp
            restore.domain = form.domain
            if restore.client is not None:
                restore.client.email = form.email
            else:
                whop_session = WhopSession.query.get(restore.sessionId)
                whop_payment = WhopPayment.query.get(whop_session.paymentId)
                whop_payment.receiptEmail = form.email

            restore.statusId = status.id
            db.session.commit()
            return ProtobufResponse().success(HTTPStatus.OK)
        except Exception as exception:
            log.error("Unable to update restore date: %s", exception)
            return ProtobufResponse().failure(HTTPStatus.UNPROCESSABLE_ENTITY, error="Unable to update orderd")
    else:
        return ProtobufResponse().failure(HTTPStatus.UNPROCESSABLE_ENTITY, error="Invalid data received")


@cognito_auth_header_required_api
@admin_required
def queue(body):
    form = response_pb2.QueueForm()
    form.ParseFromString(body)

    if form.IsInitialized() and form.domain != "" and form.timestamp != "" and form.restoreId != "" and form.email != "" and form.action != "" and form.method != "":
        send_message(json.dumps({"email": form.email}), domain=form.domain, timestamp=form.timestamp, id=form.restoreId,
                     action=form.action, method=form.method)
        return ProtobufResponse().success(HTTPStatus.OK)
    else:
        return ProtobufResponse().failure(HTTPStatus.UNPROCESSABLE_ENTITY, error="Invalid data received")


@cognito_auth_header_required_api
@admin_required
def abandoned_sessions():
    """Return sessions where email was captured but payment never completed."""
    sessions = (
        WhopSession.query
        .filter(WhopSession.email.isnot(None))
        .filter(WhopSession.email != "")
        .filter(WhopSession.paymentId.is_(None))
        .order_by(WhopSession.createdAt.desc())
        .all()
    )
    result = []
    for session in sessions:
        session_restores = Restore.query.filter_by(sessionId=session.sessionId).all()
        result.append((session, session_restores))
    return ProtobufResponse().success(HTTPStatus.OK, abandonedSessions=result)
