#!/usr/bin/env python3
"""Boto3 user handler"""

import logging.config
import hashlib
import hmac
import base64
from http import HTTPStatus
import requests
import boto3
from flask import current_app
from src.config import db
from src.model.orm import Client
from .common import get_whop_subscription_status, get_client
from .response import ProtobufResponse

log = logging.getLogger(__name__)

class CognitoUser():
    """Boto3 user handler class"""
    LOGIN_FIELDS = ["username", "password", "recaptcha"]
    SIGN_UP_FIELDS = ["username", "email", "password", "recaptcha"]
    FORGOT_PASSWORD_FIELDS  = ["username", "recaptcha"]
    CONFIRM_FORGOT_PASSWORD_FIELDS = ["username", "password", "token", "recaptcha"]
    CONTACT_FIELDS = ["name", "email", "message", "recaptcha"]
    CART_FIELDS = ["domain", "timestamp"]

    @staticmethod
    def get_secret_hash(username):
        """Get cognito secret hash for user"""
        msg = username + current_app.config.get("COGNITO_APP_CLIENT_ID")
        dig = hmac.new(str(current_app.config.get("COGNITO_APP_CLIENT_SECRET")).encode("utf-8"),
        msg = str(msg).encode("utf-8"), digestmod=hashlib.sha256).digest()
        secret = base64.b64encode(dig).decode()
        return secret

    @staticmethod
    def initiate_auth(username, password):
        """Login user using cognito"""
        try:
            client = boto3.client("cognito-idp",
                region_name=current_app.config.get("COGNITO_REGION"))
            resp = client.initiate_auth(
                ClientId=current_app.config.get("COGNITO_APP_CLIENT_ID"),
                AuthFlow="USER_PASSWORD_AUTH",
                AuthParameters={
                    "USERNAME": username,
                    "SECRET_HASH": CognitoUser.get_secret_hash(username),
                    "PASSWORD": password,
                })
            client_record = get_client(username)
            if client_record is None:
                log.warning("No DB record found for (%s) - creating one now", username)
                try:
                    user_info = client.admin_get_user(
                        UserPoolId=current_app.config.get("COGNITO_USERPOOL_ID"),
                        Username=username
                    )
                    email = next((a["Value"] for a in user_info.get("UserAttributes", [])
                                  if a["Name"] == "email"), "")
                    CognitoUser.create_db_user(username, email)
                    client_record = get_client(username)
                except Exception as db_exc:
                    log.error("Unable to auto-create DB record for (%s): %s", username, db_exc)
            return ProtobufResponse().success(HTTPStatus.OK,
                                       user={"is_subscribed": get_whop_subscription_status(username),
                                             "is_admin": client_record.admin if client_record else False,
                                             "id_token": resp["AuthenticationResult"]["IdToken"]})
        except client.exceptions.NotAuthorizedException:
            log.warning("The username or password is incorrect for: %s", username)
            return ProtobufResponse().failure(status=HTTPStatus.UNPROCESSABLE_ENTITY,
                error="The username or password is incorrect")
        except client.exceptions.UserNotConfirmedException:
            log.warning("User (%s) is not confirmed", username)
            return ProtobufResponse().failure(status=HTTPStatus.UNPROCESSABLE_ENTITY,
                error="User is not confirmed")
        except Exception as exception:
            log.error(exception)
            return ProtobufResponse().failure(status=HTTPStatus.BAD_REQUEST,
                error=str(exception).replace("\n", " "))

    @staticmethod
    def create_cognito_user(username, password, email):
        """Create cognito and db user"""
        client = boto3.client("cognito-idp", region_name=current_app.config.get("COGNITO_REGION"))
        try:
            client.sign_up(
                ClientId=current_app.config.get("COGNITO_APP_CLIENT_ID"),
                SecretHash=CognitoUser.get_secret_hash(username),
                Username=username,
                Password=password,
                UserAttributes=[
                {
                    "Name": "email",
                    "Value": email
                }
                ],
                ValidationData=[
                    {
                    "Name": "email",
                    "Value": email
                },
                {
                    "Name": "custom:username",
                    "Value": username
                }
                ])
            CognitoUser.create_db_user(username, email)
        except client.exceptions.UsernameExistsException:
            log.warning("The username (%s) already exists", username)
            return ProtobufResponse().failure(status=HTTPStatus.UNPROCESSABLE_ENTITY,
                error="The username already exists")
        except client.exceptions.InvalidPasswordException:
            log.warning("Password should be at least 8 characters in length, and contain uppercase lettters, lowercase letters, numbers and special characters")
            return ProtobufResponse().failure(status=HTTPStatus.UNPROCESSABLE_ENTITY,
                error="Password should be at least 8 characters in length, and contain uppercase lettters, lowercase letters, numbers and special characters")
        except client.exceptions.UserLambdaValidationException:
            log.warning("Email (%s) already exists", email)
            return ProtobufResponse().failure(status=HTTPStatus.UNPROCESSABLE_ENTITY,
                error="Email already exists")
        except Exception as exception:
            log.error(exception)
            return ProtobufResponse().failure(status=HTTPStatus.BAD_REQUEST,
                error=str(exception).replace("\n", " "))
        log.info("Successfully created user (%s)", username)
        return ProtobufResponse().success(status=HTTPStatus.CREATED,
            info="Please check your email for a verification code to confirm your account")

    @staticmethod
    def confirm_signup(username, code):
        """Confirm user signup with Cognito verification code"""
        client = boto3.client("cognito-idp", region_name=current_app.config.get("COGNITO_REGION"))
        try:
            client.confirm_sign_up(
                ClientId=current_app.config.get("COGNITO_APP_CLIENT_ID"),
                SecretHash=CognitoUser.get_secret_hash(username),
                Username=username,
                ConfirmationCode=code,
                ForceAliasCreation=False
            )
            log.info("Successfully confirmed user (%s)", username)
            return ProtobufResponse().success(status=HTTPStatus.OK,
                info="Account confirmed! You can now login.")
        except client.exceptions.CodeMismatchException:
            return ProtobufResponse().failure(status=HTTPStatus.UNPROCESSABLE_ENTITY,
                error="Invalid verification code")
        except client.exceptions.ExpiredCodeException:
            return ProtobufResponse().failure(status=HTTPStatus.UNPROCESSABLE_ENTITY,
                error="Verification code has expired, please sign up again")
        except client.exceptions.UserNotFoundException:
            return ProtobufResponse().failure(status=HTTPStatus.UNPROCESSABLE_ENTITY,
                error="User not found")
        except client.exceptions.NotAuthorizedException:
            return ProtobufResponse().failure(status=HTTPStatus.UNPROCESSABLE_ENTITY,
                error="User is already confirmed")
        except Exception as exception:
            log.error(exception)
            return ProtobufResponse().failure(status=HTTPStatus.BAD_REQUEST,
                error=str(exception).replace("\n", " "))

    @staticmethod
    def delete_cognito_user(username, access_token):
        """Delete cognito and db user"""
        client = boto3.client("cognito-idp", region_name=current_app.config.get("COGNITO_REGION"))
        try:
            client.delete_user(
                AccessToken=access_token)
            CognitoUser.delete_db_user(username)
        except client.exceptions.ResourceNotFoundException:
            log.warning("The user (%s) does not exist", username)
            return ProtobufResponse().failure(status=HTTPStatus.UNPROCESSABLE_ENTITY,
                error="The user does not exist")
        except Exception as exception:
            log.error(exception)
            return ProtobufResponse().failure(status=HTTPStatus.BAD_REQUEST,
                error=str(exception).replace("\n", " "))
        log.info("Successfully deleted user (%s)", username)
        return ProtobufResponse().success(status=HTTPStatus.OK,
            info="Successfully deleted cognito user")

    @staticmethod
    def confirm_signup(username):
        """Confirm cognito user"""
        client = boto3.client("cognito-idp", region_name=current_app.config.get("COGNITO_REGION"))
        try:
            client.admin_confirm_sign_up(
                UserPoolId=current_app.config.get("COGNITO_USERPOOL_ID"),
                Username=username)
        except client.exceptions.ResourceNotFoundException:
            log.warning("The user (%s) does not exist", username)
            return ProtobufResponse().failure(status=HTTPStatus.UNPROCESSABLE_ENTITY,
                error="The user does not exist")
        except Exception as exception:
            log.error(exception)
            return ProtobufResponse().failure(status=HTTPStatus.BAD_REQUEST,
                error=str(exception).replace("\n", " "))
        log.info("Successfully confirmed user (%s)", username)
        return ProtobufResponse().success(status=HTTPStatus.OK,
            info="Successfully confirmed cognito user")

    @staticmethod
    def create_db_user(username, email):
        """Create user in db"""
        log.info("Creating db user (%s)", username)
        try:
            db.session.add(Client(username=username, email=email))
            db.session.commit()
        except Exception as exception:
            log.error("Unable to create db user (%s): %s", username, exception)

    @staticmethod
    def delete_db_user(username):
        """Delete user in db"""
        log.info("Deleting db user (%s)", username)
        try:
            client = Client.query.get(username)
            db.session.delete(client)
            db.session.commit()
        except Exception as exception:
            log.error("Unable to delete db user (%s): %s", username, exception)

    @staticmethod
    def validate_recaptcha(token):
        """Validate hcaptcha"""
        url = "https://hcaptcha.com/siteverify"
        params = {"secret": current_app.config.get("HCAPTCHA_SECRET"),
            "response": token, "sitekey": current_app.config.get("HCAPTCHA_SITE_KEY")}
        try:
            response = requests.post(url, data=params).json()
            if not response.get("success"):
                log.warning("hCaptcha validation failed — error-codes: %s", response.get("error-codes"))
            return response.get("success", False)
        except Exception as exception:
            log.warning("Unable to validate hcaptcha with token (%s): %s", token, exception)
            return False

    @staticmethod
    def sign_out(token):
        """Signout user"""
        try:
            client = boto3.client("cognito-idp",
                region_name=current_app.config.get("COGNITO_REGION"))
            client.global_sign_out(
                AccessToken=token
            )
            return ProtobufResponse().success(status=HTTPStatus.OK,
                info="Successfully sign out of all devices")
        except Exception as exception:
            log.error("Unable to signout for: %s", exception)
            return ProtobufResponse().failure(status=HTTPStatus.BAD_REQUEST,
                error=str(exception).replace("\n", " "))

    @staticmethod
    def forgot_password(username):
        """Initiate forgot password request"""
        try:
            client = boto3.client("cognito-idp",
                region_name=current_app.config.get("COGNITO_REGION"))
            client.forgot_password(
                ClientId=current_app.config.get("COGNITO_APP_CLIENT_ID"),
                SecretHash=CognitoUser.get_secret_hash(username),
                Username=username
            )
            return ProtobufResponse().success(status=HTTPStatus.OK,
                info="Successfully sent reset token. Please verify your emails.")
        except Exception as exception:
            log.error("Unable to reset password for %s: %s", username, exception)
            return ProtobufResponse().failure(status=HTTPStatus.BAD_REQUEST,
                error=str(exception).replace("\n", " "))

    @staticmethod
    def confirm_forgot_password(username, token, password):
        """Finalize forgot password request"""
        try:
            client = boto3.client("cognito-idp",
                region_name=current_app.config.get("COGNITO_REGION"))
            client.confirm_forgot_password(
                ClientId=current_app.config.get("COGNITO_APP_CLIENT_ID"),
                SecretHash=CognitoUser.get_secret_hash(username),
                Username=username,
                ConfirmationCode=token,
                Password=password,
            )
            return ProtobufResponse().success(status=HTTPStatus.OK,
                info="Successfully reset password")
        except Exception as exception:
            log.error("Unable to reset password for %s: %s", username, exception)
            return ProtobufResponse().failure(status=HTTPStatus.BAD_REQUEST,
                error=str(exception).replace("\n", " "))
