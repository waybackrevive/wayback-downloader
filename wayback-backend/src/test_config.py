#!/usr/bin/env python3
"""Configure flask app"""

import os
import sys
import secrets
import connexion
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_caching import Cache
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)) + "/..")
from src.lib.flask_cognito import CognitoAuth

def create_app():
    return connexion.App(__name__, specification_dir="./swagger/")

cogauth = CognitoAuth()
db = SQLAlchemy()
cache = Cache(config={"CACHE_TYPE": "SimpleCache", "CACHE_DEFAULT_TIMEOUT": 300})
limiter = Limiter(key_func=get_remote_address)
