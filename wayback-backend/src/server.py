#!/usr/bin/env python3
"""Initialize flask app"""

import os
import sys
import logging.config
import yaml
from urllib.parse import quote_plus
try:
    import pymysql
    pymysql.install_as_MySQLdb()
except ImportError:
    pass
from http import HTTPStatus
from flask_cors import CORS
from src.lib.flask_sitemap import Sitemap
from src.lib.common import ProtobufResponse
from src.config import connex_app, app, db, cogauth, cache, limiter
from connexion.exceptions import BadRequestProblem, NonConformingResponse

with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "logging.yaml"), "r") as f:
    log_cfg = yaml.safe_load(f.read())
    logging.config.dictConfig(log_cfg)
log = logging.getLogger(__name__)


def run():
    """Start flask server in dev mode"""
    connex_app = create_app()[1]
    log.info("Starting wayback-backend")
    connex_app.run(host="0.0.0.0", port=5000, debug=os.environ.get("SWAGGER_DEBUG") == "True")


def error_request_handler(error):
    return ProtobufResponse().failure(HTTPStatus.BAD_REQUEST, error=error.detail)


def create_app():
    """Runtime configuration of flask"""
    app.config["TESTING"] = False
    app.config["SITEMAP_INCLUDE_RULES_WITHOUT_PARAMS"] = True
    app.config["SITEMAP_IGNORE_ENDPOINTS"] = ["_openapi_json", "_openapi_yaml"]
    app.config["SITEMAP_URL_SCHEME"] = "https"
    app.config["SQLALCHEMY_ECHO"] = False
    app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://%s:%s@%s/%s" % \
                                            (os.environ.get("DATABASE_USERNAME"),
                                             quote_plus(os.environ.get("DATABASE_PASSWORD", "")),
                                             os.environ.get("DATABASE_HOST"),
                                             os.environ.get("DATABASE_NAME"))
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["WHOP_API_KEY"] = os.environ.get("WHOP_API_KEY")
    app.config["WHOP_WEBHOOK_SECRET"] = os.environ.get("WHOP_WEBHOOK_SECRET")
    app.config["WHOP_COMPANY_ID"] = os.environ.get("WHOP_COMPANY_ID")
    app.config["WHOP_SINGLE_PLAN_ID"] = os.environ.get("WHOP_SINGLE_PLAN_ID")
    app.config["WHOP_BASIC_PLAN_ID"] = os.environ.get("WHOP_BASIC_PLAN_ID")
    app.config["WHOP_SUBSCRIPTION_PLAN_ID"] = os.environ.get("WHOP_SUBSCRIPTION_PLAN_ID")
    app.config["APP_DOMAIN"] = os.environ.get("APP_DOMAIN")
    app.config["SQS_NAME"] = os.environ.get("SQS_NAME")
    app.config["SQS_REGION"] = os.environ.get("SQS_REGION")
    app.config["COGNITO_REGION"] = "eu-north-1"
    app.config["COGNITO_USERPOOL_ID"] = os.environ.get("COGNITO_USERPOOL_ID")
    app.config["COGNITO_APP_CLIENT_ID"] = os.environ.get("COGNITO_APP_CLIENT_ID")
    app.config["COGNITO_APP_CLIENT_SECRET"] = os.environ.get("COGNITO_APP_CLIENT_SECRET")
    app.config["COGNITO_CHECK_TOKEN_EXPIRATION"] = True
    app.config["COGNITO_JWT_HEADER_NAME"] = "Authorization"
    app.config["COGNITO_JWT_HEADER_PREFIX"] = "Bearer"
    app.config["RECAPTCHA_HEADER_NAME"] = "Recaptcha"
    app.config["HCAPTCHA_SECRET"] = os.environ.get("HCAPTCHA_SECRET")
    app.config["HCAPTCHA_SITE_KEY"] = os.environ.get("HCAPTCHA_SITE_KEY")
    app.config["CONTACT_EMAIL"] = os.environ.get("CONTACT_EMAIL")
    connex_app.add_api("wayback.yaml", options={"swagger_ui": os.environ.get("SWAGGER_UI") == "True"})
    connex_app.add_error_handler(BadRequestProblem, error_request_handler)
    connex_app.add_error_handler(NonConformingResponse, error_request_handler)
    db.init_app(app)
    cogauth.init_app(app)
    cache.init_app(app)
    limiter.init_app(app)
    CORS(app)
    Sitemap(app)

    return app, connex_app


if __name__ == "__main__":
    run()
else:
    app = create_app()[0]
