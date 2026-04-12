import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from src.model.orm import base, Restore, Status, Client
from src.lib.db import check_db, update_db, get_db_session

@pytest.fixture()
def session():
    engine = create_engine("sqlite://")
    base.metadata.create_all(engine)
    session = scoped_session(sessionmaker())(bind=engine)
    session.add(Status(status="Awaiting Payment"))
    session.add(Status(status="Submitted"))
    session.add(Status(status="In Progress"))
    session.add(Status(status="Done"))
    session.add(Client(username="nicolas", email="nick@onintime.com", customerId=None, subscriptionId=None))
    session.commit()
    return session

def test_check_db_false(session):
    session.add(Restore(id="900813d1-c34b-4fe2-9de2-792159aed202", timestamp="123", domain="onintime.com",
        statusId=1, username="nicolas", transactDate="20200405"))
    session.commit()
    assert check_db(session, "900813d1-c34b-4fe2-9de2-792159aed202") == False

def test_check_db_true(session):
    session.add(Restore(id="900813d1-c34b-4fe2-9de2-792159aed202", timestamp="123", domain="onintime.com",
        statusId=2, username="nicolas", transactDate="20200405"))
    session.commit()
    assert check_db(session, "900813d1-c34b-4fe2-9de2-792159aed202") == True

def test_update_db(session):
    session.add(Restore(id="0d3b736a-093e-448c-ae2e-c72c375001cf", timestamp="123", domain="onintime.com",
        statusId=1, username="nicolas", transactDate="20200405"))
    session.commit()
    update_db(session, 3, "0d3b736a-093e-448c-ae2e-c72c375001cf", "test")
    restore = session.query(Restore).get("0d3b736a-093e-448c-ae2e-c72c375001cf")
    assert restore.id == "0d3b736a-093e-448c-ae2e-c72c375001cf"
    assert restore.statusId == 3
    assert restore.s3Url == "test"
