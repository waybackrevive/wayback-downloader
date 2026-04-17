#!/usr/bin/env python3
"""SQLAlchemy db model"""

from datetime import datetime
from sqlalchemy_serializer import SerializerMixin
from src.config import db

class Status(db.Model, SerializerMixin):
    """Status table in db"""
    __tablename__ = "status"
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(255), nullable=False)

class Restore(db.Model, SerializerMixin):
    """Restore table in db"""
    __tablename__ = "restores"
    id = db.Column(db.String(128), primary_key=True)
    timestamp = db.Column(db.String(255), nullable=False)
    domain = db.Column(db.String(255), nullable=False)
    statusId = db.Column(db.Integer, db.ForeignKey("status.id"), nullable=False)
    username = db.Column(db.String(255), db.ForeignKey("clients.username"), nullable=True)
    s3Url = db.Column(db.String(255), nullable=True)
    sessionId = db.Column(db.String(255), nullable=True)
    transactDate = db.Column(db.Integer, nullable=False)

    client = db.relationship("Client")
    status = db.relationship("Status")

class Client(db.Model, SerializerMixin):
    """Client table in db"""
    __tablename__ = "clients"
    username = db.Column(db.String(255), primary_key=True)
    email = db.Column(db.String(255), nullable=False)
    whopUserId = db.Column(db.String(255), nullable=True)
    whopMembershipId = db.Column(db.String(255), nullable=True)
    admin = db.Column(db.Boolean, nullable=False, default=False)

class WhopSession(db.Model, SerializerMixin):
    """WhopSession table in db — maps our internal session to a Whop checkout link"""
    __tablename__ = "whop_session"
    sessionId = db.Column(db.String(255), primary_key=True)
    checkoutId = db.Column(db.String(255), nullable=True, index=True)
    paymentId = db.Column(db.String(255), nullable=True)
    username = db.Column(db.String(255), db.ForeignKey("clients.username"), nullable=True)
    subscription = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(255), nullable=True)
    createdAt = db.Column(db.DateTime, nullable=True, default=datetime.utcnow)
    checkoutUrl = db.Column(db.String(512), nullable=True)
    recoverySentCount = db.Column(db.Integer, nullable=False, default=0)

    client = db.relationship("Client")

class WhopPayment(db.Model, SerializerMixin):
    """WhopPayment table in db"""
    __tablename__ = "whop_payment"
    paymentId = db.Column(db.String(255), primary_key=True)
    amount = db.Column(db.String(255), nullable=False)
    receiptUrl = db.Column(db.String(255), nullable=True)
    receiptEmail = db.Column(db.String(255), nullable=False)

class Receipt(db.Model, SerializerMixin):
    """Receipt table in db"""
    __tablename__ = "receipts"
    id = db.Column(db.String(128), primary_key=True)
    url = db.Column(db.String(255), nullable=False)
    date = db.Column(db.Date, nullable=False)
    username = db.Column(db.String(255), db.ForeignKey("clients.username"), nullable=True)
    amount = db.Column(db.String(255), nullable=False)
    sessionId = db.Column(db.String(255), nullable=False)

    client = db.relationship("Client")
