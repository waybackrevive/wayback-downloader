import os
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship

base = declarative_base()

class Status(base):
    __tablename__ = "status"
    id = Column(Integer, primary_key=True)
    status = Column(String(255), nullable=False)

class Restore(base):
    __tablename__ = "restores"
    id = Column(String(128), primary_key=True)
    timestamp = Column(String(255), nullable=False)
    domain = Column(String(255), nullable=False)
    statusId = Column(Integer, ForeignKey("status.id"))
    username = Column(String(255), ForeignKey("clients.username"), nullable=True)
    s3Url = Column(String(255), nullable=True)
    sessionId = Column(String(255), nullable=True)
    transactDate = Column(String(255), nullable=False)

    client = relationship("Client")
    status = relationship("Status")

class Client(base):
    """Client table in db"""
    __tablename__ = "clients"
    username = Column(String(255), primary_key=True)
    email = Column(String(255), nullable=False)
    customerId = Column(String(255), nullable=True)
    subscriptionId = Column(String(255), nullable=True)

    @property
    def serialized(self):
        """Serializes client objecte"""
        return {
            "username": self.username,
            "email": self.email,
            "customerId": self.customerId,
            "subscriptionId": self.subscriptionId
        }
