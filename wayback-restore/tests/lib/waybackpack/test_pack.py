import os
import shutil
from src.lib.waybackpack import Pack, search, Session

def test_download_to():
    dir = "test"
    pack = search({"onintime.com"},
        session=Session(),
        timestamp="20190607023527"
    )
    Pack(pack, Session(), dir).download_to()
    assert os.path.isdir(dir)
    assert os.path.exists(dir + "/index.html")
    assert os.path.isdir(dir + "/css")
    assert os.path.isdir(dir + "/img")
    assert os.path.isdir(dir + "/js")
    shutil.rmtree(dir)
