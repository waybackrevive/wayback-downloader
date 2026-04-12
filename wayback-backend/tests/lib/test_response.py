from http import HTTPStatus
from src.protobuf import response_pb2
from src.lib.response import HttpResponse, ProtobufResponse

def test_http_success():
    assert HttpResponse().success(HTTPStatus.OK, info="test") == ({"data": {"info": "test"}, "error": "", "status": "success"}, 200)

def test_http_failure():
    assert HttpResponse().failure(HTTPStatus.BAD_REQUEST, error="test") == ({"data": {}, "error": "test", "status": "failure"}, 400)

def test_protobuf_success():
    response = response_pb2.Response()
    response.error = ""
    response.data.CopyFrom(response_pb2.Data())
    response.status = response_pb2.SUCCESS
    assert ProtobufResponse().success(HTTPStatus.OK) == (response.SerializeToString(), 200)

def test_protobuf_failure():
    response = response_pb2.Response()
    response.error = "test"
    response.data.CopyFrom(response_pb2.Data())
    response.status = response_pb2.FAILED
    assert ProtobufResponse().failure(HTTPStatus.BAD_REQUEST, error="test") == (response.SerializeToString(), 400)