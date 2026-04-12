import json
from datetime import datetime
from src.model.orm import Status, Restore, Receipt, Client, StripeSession, StripePayment

def test_status():
    status = Status(id=1, status="In Progress")
    assert status.id == 1
    assert status.status == "In Progress"

def test_restore():
    restore = Restore(id="67918f69-ec94-478b-a840-a1fb6ae5cad8", timestamp="20140505", domain="onintime.com",
        statusId=1, username="test", s3Url="http://amazon.ca", sessionId="12345", transactDate=1630028635)
    assert restore.id == "67918f69-ec94-478b-a840-a1fb6ae5cad8"
    assert restore.timestamp == "20140505"
    assert restore.domain == "onintime.com"
    assert restore.statusId == 1
    assert restore.username == "test"
    assert restore.s3Url == "http://amazon.ca"
    assert restore.sessionId == "12345"
    assert restore.transactDate == 1630028635

def test_receipts():
    date = datetime.now()
    receipt = Receipt(id="fc323d93-20fb-41e2-9ccd-0cd97feb7c1d", url="http://test.com", date=date,
        username="test", amount="123.123")
    assert receipt.id == "fc323d93-20fb-41e2-9ccd-0cd97feb7c1d"
    assert receipt.url == "http://test.com"
    assert receipt.date == date
    assert receipt.username == "test"
    assert receipt.amount == "123.123"

def test_client():
    client = Client(username="test", email="test@test.com", customerId="1234", subscriptionId="1234")
    assert client.username == "test"
    assert client.email == "test@test.com"
    assert client.customerId == "1234"
    assert client.subscriptionId == "1234"
    assert json.dumps(client.serialized) == '{"username": "test", "email": "test@test.com", "customerId": "1234", "subscriptionId": "1234"}'

def test_stripesession():
    stripe_session = StripeSession(sessionId="1234", paymentIntent="1234", username="test", subscription="1234")
    assert stripe_session.sessionId == "1234"
    assert stripe_session.paymentIntent == "1234"
    assert stripe_session.username == "test"
    assert stripe_session.subscription == "1234"

def test_stripepayment():
    stripe_payment = StripePayment(paymentIntent="1234", amount="1234", invoiceUrl="http://amazon.com")
    assert stripe_payment.paymentIntent == "1234"
    assert stripe_payment.amount == "1234"
    assert stripe_payment.invoiceUrl == "http://amazon.com"
