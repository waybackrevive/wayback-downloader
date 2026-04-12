from src.lib.waybackpack import search

def test_search_success():
    """
    NOTE: The timestamp result is lower than what was requested because it
    is the latest snapshot which is not a duplicate.
    """
    assert [{'urlkey': 'com,onintime)/', 'timestamp': '20171105130139', \
        'original': 'https://www.onintime.com/', 'mimetype': 'text/html', \
        'statuscode': '200', 'digest': 'BLHTBJVFSATCAKL7NCATQUY3L4IC7SKC', \
        'length': '5476', 'dupecount': '0'}] == search({"onintime.com"}, "20190607023527")

def test_search_exception():
    assert [] == search(["onintime.com"], "19000607023527")

def test_search_invalid_domain():
    assert [] == search({"a"}, "19000607023527")

def test_search_invalid_timestamp():
    assert [] == search({"onintime.com"}, "a")
