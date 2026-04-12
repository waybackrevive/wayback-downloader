import json
from src.model.orm import Status, Restore, Client

def test_status():
    status = Status(id=1, status="In Progress")
    assert status.id == 1
    assert status.status == "In Progress"

def test_restore():
    restore = Restore(id="945670fd-bb37-4ac9-950a-6d9cb9c28dad", timestamp="20140505", domain="onintime.com",
        statusId=1, username="test", s3Url="http://amazon.ca", sessionId="12345", transactDate="20200405")
    assert restore.id == "945670fd-bb37-4ac9-950a-6d9cb9c28dad"
    assert restore.timestamp == "20140505"
    assert restore.domain == "onintime.com"
    assert restore.statusId == 1
    assert restore.username == "test"
    assert restore.s3Url == "http://amazon.ca"
    assert restore.sessionId == "12345"
    assert restore.transactDate == "20200405"

def test_client():
    client = Client(username="test", email="test@test.com", customerId="1234", subscriptionId="1234")
    assert client.username == "test"
    assert client.email == "test@test.com"
    assert client.customerId == "1234"
    assert client.subscriptionId == "1234"
    assert json.dumps(client.serialized) == '{"username": "test", "email": "test@test.com", "customerId": "1234", "subscriptionId": "1234"}'
