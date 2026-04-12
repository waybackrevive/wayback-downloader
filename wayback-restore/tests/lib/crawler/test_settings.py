from src.lib.crawler import settings

def test_settings():
    assert settings.USER_AGENT == "waybackdownload"
    assert settings.LOG_LEVEL == "INFO"
    assert settings.AUTOTHROTTLE_ENABLED == True
    assert settings.AUTOTHROTTLE_DEBUG == False
    assert settings.AUTOTHROTTLE_START_DELAY == 1
    assert settings.AUTOTHROTTLE_TARGET_CONCURRENCY == 1.0
