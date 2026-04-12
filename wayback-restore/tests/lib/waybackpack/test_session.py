from src.lib.waybackpack import Session

def test_get():
    assert Session().get("https://onintime.com") is not None

def test_get_invalid():
    assert Session().get("test.asdf") is None
