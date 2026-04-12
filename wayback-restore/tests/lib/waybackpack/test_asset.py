from src.lib.waybackpack import Asset

def test_get_archive_url():
    assert "https://web.archive.org/web/20190607023527/onintime.com" \
        == Asset("onintime.com", "20190607023527").get_archive_url()

def test_get_archive_url_raw():
    assert "https://web.archive.org/web/20190607023527id_/onintime.com" \
        == Asset("onintime.com", "20190607023527").get_archive_url(raw=True)

def test_fetch():
    assert Asset("onintime.com", "20190607023527").fetch() is not None

def test_fetch_raw():
    assert Asset("onintime.com", "20190607023527").fetch(raw=True) is not None

def test_fetch_invalid():
    assert Asset("asdasdawdadas.asdasdasd", "1900").fetch() is None
