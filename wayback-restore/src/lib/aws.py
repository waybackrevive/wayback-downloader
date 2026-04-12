#!/usr/bin/env python3
"""
This module empasses various functions used to call AWS services
"""

import logging
import os
import boto3
from .common import load_page

log = logging.getLogger(__name__)


def send_message(content, **kwargs):
    """Queue up website restore into SQS"""
    messageAttributes = {}
    for key, value in kwargs.items():
        messageAttributes.update({key: {"DataType": "String", "StringValue": str(value)}})
    try:
        sqs = boto3.client("sqs", region_name=os.environ.get("SQS_REGION"))
        response = sqs.send_message(
            QueueUrl="https://sqs.%s.amazonaws.com/509399598152/%s" % (os.environ.get("SQS_REGION"), os.environ.get("SQS_NAME")),
            MessageAttributes=messageAttributes,
            MessageBody=(content)
        )
        return response
    except Exception as exception:
        log.error("Unable to queue message on: %s", exception)


def delete_message(receiptHandle):
    """Delete queue message from SQS"""
    try:
        log.info("Deleting Message in Queue")
        sqs = boto3.client("sqs", region_name=os.environ.get("SQS_REGION"))
        response = sqs.delete_message(
            QueueUrl="https://sqs.%s.amazonaws.com/509399598152/%s" % (os.environ.get("SQS_REGION"), os.environ.get("SQS_NAME")),
            ReceiptHandle=receiptHandle
        )
        return response
    except Exception as exception:
        log.error("Unable to delete message %s: %s", receiptHandle, exception)


def receive_message():
    """Get queue message from SQS"""
    try:
        sqs = boto3.client("sqs", region_name=os.environ.get("SQS_REGION"))
        response = sqs.receive_message(
            QueueUrl="https://sqs.%s.amazonaws.com/509399598152/%s" % (os.environ.get("SQS_REGION"), os.environ.get("SQS_NAME")),
            AttributeNames=[
                "SentTimestamp"
            ],
            MaxNumberOfMessages=1,
            MessageAttributeNames=[
                "All"
            ],
            VisibilityTimeout=0,
            WaitTimeSeconds=10
        )
        if "Messages" in response:
            message = response["Messages"][0]
            receipt_handle = message["ReceiptHandle"]
            delete_message(receipt_handle)
            return message
        return None
    except Exception as exception:
        log.error("Unable to queue message: %s", exception)


def s3_upload(filename):
    """Upload file to S3"""
    try:
        client = boto3.client("s3", region_name=os.environ.get("S3_REGION"))
        with open(filename, "rb") as file:
            client.upload_fileobj(file, os.environ.get("S3_NAME"), filename)
        return client.generate_presigned_url("get_object",
                                             Params={"Bucket": os.environ.get("S3_NAME"), "Key": filename},
                                             ExpiresIn=2592000)
    except Exception as exception:
        log.error("Unable to upload file: %s", exception)


def s3_delete_file(filename):
    """Delete file to S3"""
    try:
        client = boto3.client("s3", region_name=os.environ.get("S3_REGION"))
        response = client.delete_object(
            Bucket=os.environ.get("S3_NAME"),
            Key=filename
        )
        return response
    except Exception as exception:
        log.error("Unable to delete file: %s", exception)


def s3_get_file(filename):
    """Get S3 file"""
    try:
        client = boto3.client("s3", region_name=os.environ.get("S3_REGION"))
        response = client.get_object(
            Bucket=os.environ.get("S3_NAME"),
            Key=filename
        )
        return response
    except Exception as exception:
        log.error("Unable to get S3 file: %s", exception)
        return None


def send_email(recipient, template="order_ready", **kwargs):
    """Send email to client using SES"""
    try:
        client = boto3.client("ses", region_name="us-west-2")
        message = {"Subject": {"Data": "Your order is ready!"},
                   "Body": {"Text": {"Data": "Your order is ready! \
                    You can download your restored website by heading to the "},
                            "Html": {"Data": load_page(template, **kwargs)}}}
        client.send_email(
            Source="Wayback Download Support <support@wayback.download>",
            Destination={"ToAddresses": [recipient]},
            Message=message,
            ReplyToAddresses=["Wayback Download Support <support@wayback.download>"])
        return True
    except Exception as exception:
        log.error("Unable to send email to %s: %s", recipient, exception)
        return False
