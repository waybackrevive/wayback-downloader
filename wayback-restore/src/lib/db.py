#!/usr/bin/env python3
"""
This module empasses various functions used to query the database
"""

import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from src.model.orm import base, Restore

log = logging.getLogger(__name__)


def check_db(session, id):
    """Check if restore is already processed"""
    restore = session.query(Restore).get(id)
    if restore is not None:
        return restore.statusId == 2
    else:
        return False

def get_s3_url(session, id):
    restore = session.query(Restore).get(id)
    if restore is not None:
        return restore.s3Url
    else:
        return None

def update_db(session, status, id, s3Url=None):
    """Update restore table in db"""
    restore = session.query(Restore).get(id)
    restore.statusId = status
    if s3Url is not None:
        restore.s3Url = s3Url
    session.commit()


def get_db_session():
    """Get db session"""
    engine = create_engine("mysql://%s:%s@%s/%s" % (os.environ.get("DATABASE_USERNAME"),
                                                    os.environ.get("DATABASE_PASSWORD"),
                                                    os.environ.get("DATABASE_HOST"),
                                                    os.environ.get("DATABASE_NAME")))
    base.metadata.create_all(engine)
    return scoped_session(sessionmaker())(bind=engine)
