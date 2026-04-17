#!/usr/bin/env python3

from src.protobuf import response_pb2

"""Custom http response handler"""

class HttpResponse:
    """Custom http response class"""
    def _resp(self, status, **kwargs):
        data = {}
        error = ""
        for key, value in kwargs.items():
            if key == "error":
                error = value
            else:
                data.update({key: value})
        return {
            "status": status,
            "data": data,
            "error": error
        }

    def success(self, status, **kwargs):
        """Returns successful http request"""
        return self._resp("success", **kwargs), status.value

    def failure(self, status, **kwargs):
        """Returns failed http request"""
        return self._resp("failure", **kwargs), status.value

class ProtobufResponse:
    """Custom protobuf response class"""

    def __init__(self):
        self.__response = response_pb2.Response()

    def _resp(self, status, **kwargs):
        data = response_pb2.Data()
        error = ""
        for key, value in kwargs.items():
            if key == "error":
                error = value
            elif key == "user":
                user = response_pb2.User()
                user.token = value["id_token"]
                user.subscribed = value["is_subscribed"]
                user.admin = value["is_admin"]
                data.user.CopyFrom(user)
            elif key == "receipts":
                for item in kwargs["receipts"]:
                    receipt = response_pb2.Receipt()
                    receipt.id = item.id
                    receipt.url = item.url
                    receipt.date = item.date.strftime('%Y-%m-%d')
                    receipt.amount = item.amount
                    data.receipts.append(receipt)
            elif key == "restores":
                restore = response_pb2.Restore()
                for i in kwargs["restores"]:
                    item = i[0]
                    restore.id = item.id
                    restore.timestamp = item.timestamp
                    restore.domain = item.domain
                    restore.status = item.status.status
                    if item.username is not None:
                        restore.username = item.username
                        restore.email = item.client.email
                    else:
                        restore.username = "None"
                        restore.email = i[1]
                    if item.s3Url is None:
                        restore.s3Url = ""
                    else:
                        restore.s3Url = item.s3Url
                    restore.transactDate = str(item.transactDate)
                    data.restores.append(restore)
            elif key == "restore":
                item = value[0]
                restore = response_pb2.Restore()
                restore.id = item.id
                restore.timestamp = item.timestamp
                restore.domain = item.domain
                restore.status = item.status.status
                if item.username is not None:
                    restore.username = item.username
                    restore.email = item.client.email
                else:
                    restore.username = "None"
                    restore.email = value[1]
                if item.s3Url is None:
                    restore.s3Url = ""
                else:
                    restore.s3Url = item.s3Url
                restore.transactDate = str(item.transactDate)
                data.restore.CopyFrom(restore)
            elif key == "abandonedSessions":
                for session, session_restores in value:
                    ab = response_pb2.AbandonedSession()
                    ab.sessionId = session.sessionId
                    ab.email = session.email or ""
                    ab.checkoutUrl = session.checkoutUrl or ""
                    ab.createdAt = session.createdAt.isoformat() if session.createdAt else ""
                    ab.recoverySentCount = str(session.recoverySentCount)
                    count = len(session_restores)
                    cart_val = 29.0 + max(0, count - 1) * 19.0
                    ab.cartValue = "${:.2f}".format(cart_val)
                    for r in session_restores:
                        cart_item = response_pb2.CartItem()
                        cart_item.domain = r.domain
                        cart_item.timestamp = r.timestamp
                        ab.items.append(cart_item)
                    data.abandonedSessions.append(ab)
            elif key == "id":
                data.id = value
            elif key == "url":
                data.url = value
            elif key == "info":
                data.info = value
        self.__response.error = error
        self.__response.status = status
        self.__response.data.CopyFrom(data)

    def success(self, status, **kwargs):
        """Returns successful http request"""
        self._resp(response_pb2.SUCCESS, **kwargs)
        return self.__response.SerializeToString(), status.value

    def failure(self, status, **kwargs):
        """Returns failed http request"""
        self._resp(response_pb2.FAILED, **kwargs)
        return self.__response.SerializeToString(), status.value