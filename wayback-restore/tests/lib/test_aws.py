import os
import time
import pytest
import configparser
from src.lib.aws import send_message, delete_message, receive_message, s3_upload, s3_delete_file, s3_get_file, send_email

@pytest.fixture()
def conf():
    """Get config object"""
    config = configparser.ConfigParser()
    basedir = os.path.abspath(os.path.dirname(__file__))
    config.read(basedir + "/../../src/conf/dev.ini")
    return config

def test_send_receive_message(conf):
    send_message("test", conf["sqs"]["name"], conf["sqs"]["region"])
    time.sleep(5)
    message = receive_message(conf["sqs"]["name"], conf["sqs"]["region"])
    receipt_handle = message["ReceiptHandle"]
    assert "test" == message["Body"]

def test_s3_upload(conf):
    open("test.txt", "w")
    s3_upload(conf["s3"]["name"], conf["s3"]["region"], "test.txt")
    resp = s3_get_file(conf["s3"]["name"], conf["s3"]["region"], "test.txt")
    if resp is None:
        pytest.fail()
    s3_delete_file(conf["s3"]["name"], conf["s3"]["region"], "test.txt")
    resp = s3_get_file(conf["s3"]["name"], conf["s3"]["region"], "test.txt")
    if resp is not None:
        pytest.fail()
    print(conf["s3"]["name"])
    os.remove("test.txt")

def test_send_email(conf):
    if not send_email("test@onintime.com"):
        pytest.fail()
