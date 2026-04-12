from src.lib.waybackpack import settings

def test_settings():
    assert settings.DEFAULT_ROOT == "https://web.archive.org"
    assert settings.DEFAULT_USER_AGENT == "waybackdownload"
    assert settings.MAX_RETRIES == 3
    assert settings.FOLLOW_REDIRECTS == True
    assert settings.IGNORE_ERRORS == True
    assert settings.DOWNLOAD_DIR == "test/"
    assert settings.RAW == False
