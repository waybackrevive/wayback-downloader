#!/usr/bin/env python3
"""Create all tables in db"""

import os
from urllib.parse import quote_plus
import pymysql
pymysql.install_as_MySQLdb()
from config import app
from model.orm import db, Status, Client


def run():
    """Runtime configuration of flask"""
    app.config['SQLALCHEMY_ECHO'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://%s:%s@%s/%s" % \
                                            (os.environ.get("DATABASE_USERNAME"),
                                             quote_plus(os.environ.get("DATABASE_PASSWORD", "")),
                                             os.environ.get("DATABASE_HOST"),
                                             os.environ.get("DATABASE_NAME"))
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    with app.app_context():
        db.create_all()
        db.session.add(Status(status="Awaiting Payment"))
        db.session.add(Status(status="Submitted"))
        db.session.add(Status(status="In Progress"))
        db.session.add(Status(status="Awaiting Review"))
        db.session.add(Status(status="Done"))
        db.session.add(Status(status="Error"))
        db.session.commit()


if __name__ == "__main__":
    run()
