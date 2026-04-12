import os
import logging
from jinja2 import Environment, FileSystemLoader

log = logging.getLogger(__name__)


def load_page(event_type, **kwargs):
    """Render html page using jinja"""
    try:
        basedir = os.path.abspath(os.path.dirname(__file__))
        with open(basedir + "/../templates/" + event_type + ".html") as file:
            template = Environment(loader=FileSystemLoader("./templates")).from_string(file.read())
            return template.render(**kwargs)
    except Exception as exception:
        log.error("Unable to load template (%s): %s", event_type, exception)


def generate_readme(output_dir):
    with open(os.path.join(output_dir, "README.txt"), "w") as file:
        file.write(r"===================================================" + "\n")
        file.write(r"= __        __          _                _        =" + "\n")
        file.write(r"= \ \      / /_ _ _   _| |__   __ _  ___| | __    =" + "\n")
        file.write(r"=  \ \ /\ / / _` | | | | '_ \ / _` |/ __| |/ /    =" + "\n")
        file.write(r"=   \ V  V / (_| | |_| | |_) | (_| | (__|   <     =" + "\n")
        file.write(r"=    \_/\_/ \__,_|\__, |_.__/ \__,_|\___|_|\_\    =" + "\n")
        file.write(r"=                 |___/                           =" + "\n")
        file.write(r"=  ____                      _                 _  =" + "\n")
        file.write(r"= |  _ \  _____      ___ __ | | ___   __ _  __| | =" + "\n")
        file.write(r"= | | | |/ _ \ \ /\ / / '_ \| |/ _ \ / _` |/ _` | =" + "\n")
        file.write(r"= | |_| | (_) \ V  V /| | | | | (_) | (_| | (_| | =" + "\n")
        file.write(r"= |____/ \___/ \_/\_/ |_| |_|_|\___/ \__,_|\__,_| =" + "\n")
        file.write(r"=                   				  =" + "\n")
        file.write(r"===================================================" + "\n\n")
        file.write("Your website is just moments away from shinning again!\n\n")
        file.write(
            "To quickly recover your website, we took the time to neatly organize all the supporting files by type (css/js/img/font) as well as make sure that all the links point to the proper recovered files. This makes the restore process a quick and painless task!\n\n")
        file.write("For information on how to upload your files, please take a look at the links below:\n")
        file.write("1. Uploading to Cpanel: https://wayback.download/knowledgebase#restore-cpanel\n")
        file.write("2. Uploading to an FTP/SFTP server: https://wayback.download/knowledgebase#restore-ftp\n\n")
        file.write("If you still require additional help, feel free to email us: support@wayback.download.\n\n")