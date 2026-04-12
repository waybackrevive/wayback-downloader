#!/usr/bin/env python3
"""This module serves common functions used"""

import logging
import threading
from functools import wraps
from http import HTTPStatus

import requests
import boto3
from flask import current_app, render_template, g
from htmlmin.minify import html_minify
from sqlalchemy import and_

from src.lib.response import ProtobufResponse
from src.model.orm import Client, Restore

log = logging.getLogger(__name__)


def load_page(event_type, **kwargs):
    """Render html page using jinja"""
    try:
        return html_minify(render_template(event_type + ".html", **kwargs))
    except Exception as exception:
        log.error("Unable to load template (%s): %s", event_type, exception)
        return None


def get_client(username):
    """Get client from db"""
    try:
        return Client.query.get(username)
    except Exception as exception:
        log.error("Unable to fetch client (%s): %s", username, exception)
        return None


def get_whop_subscription_status(username):
    """Check if user has an active Whop membership with remaining quota"""
    try:
        client = get_client(username)
        if client is None or client.whopMembershipId is None:
            return False
        resp = requests.get(
            "https://api.whop.com/api/v5/memberships/%s" % client.whopMembershipId,
            headers={"Authorization": "Bearer %s" % current_app.config.get("WHOP_API_KEY")},
            timeout=10
        )
        if resp.status_code != 200:
            return False
        data = resp.json()
        if not data.get("valid") or data.get("status") != "active":
            return False
        period_start = data.get("renewal_period_start", 0)
        period_end = data.get("renewal_period_end", 0)
        restores = Restore.query.filter(
            and_(
                Restore.username == username,
                Restore.transactDate >= period_start,
                Restore.transactDate < period_end
            )
        ).all()
        return len(restores) < 10
    except Exception as exception:
        log.error("Unable to get Whop subscription status for %s: %s", username, exception)
        return False


def send_message(content, **kwargs):
    """Queue up website restore into SQS"""
    messageAttributes = {}
    for key, value in kwargs.items():
        messageAttributes.update({key: {"DataType": "String", "StringValue": str(value)}})
    try:
        sqs = boto3.client("sqs", region_name=current_app.config.get("SQS_REGION"))
        t = threading.Thread(target=sqs.send_message,
                             kwargs={"QueueUrl": "https://sqs.%s.amazonaws.com/509399598152/%s" %
                                                 (current_app.config.get("SQS_REGION"),
                                                  current_app.config.get("SQS_NAME")),
                                     "MessageAttributes": messageAttributes,
                                     "MessageBody": (content)})
        t.start()
    except Exception as exception:
        log.error("Unable to queue message on: %s", exception)


def get_client_admin_status():
    """Get client from db"""
    try:
        return Client.query.get(g.cogauth_username).admin
    except Exception as exception:
        log.error("Unable to fetch client: %s", exception)
        return None


def admin_required(fn):
    @wraps(fn)
    def decorator(*args, **kwargs):
        if get_client_admin_status():
            return fn(*args, **kwargs)

        return ProtobufResponse().failure(status=HTTPStatus.UNAUTHORIZED,
                                          error="Authorization Required")

    return decorator
