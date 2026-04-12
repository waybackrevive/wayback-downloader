from src.lib.waybackpack import Asset

def test_503():
    asset = Asset(
        "https://www.amazon.com/Art-Gathering-How-Meet-Matters/dp/1594634920",
        timestamp = 20190506092829
    )
    content = asset.fetch()
    assert(content is None)
