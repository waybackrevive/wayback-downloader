#!/usr/bin/env python3
"""
This module restores websites from the Wayback Machine by downloading and cleaning files for local browsing.
"""
import json
import os
import logging
import shutil
from src.lib.aws import send_email, s3_get_file, receive_message, s3_upload
from src.lib.common import generate_readme
from src.lib.db import get_s3_url, get_db_session, update_db
from src.lib.wayback.restore import WaybackRestore

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def restore(session, id: str, domain: str, timestamp: str, max_pages: int, headless_render: bool = False) -> None:
    """
    Restore a website from the Wayback Machine.

    Args:
        id: Output directory name (used for zip filename)
        domain: Website domain to restore
        timestamp: Wayback Machine timestamp
        max_pages: Maximum number of pages to download
        config: Configuration settings
        headless_render: Whether to use headless browser rendering
    """
    try:
        # Determine the output directory from environment variable or use current directory
        output_dir = os.environ.get('WAYBACK_OUTPUT_DIR', '.')
        
        # Ensure the output directory exists
        os.makedirs(output_dir, exist_ok=True)

        # Initialize WaybackRestore with the output directory
        # WaybackRestore will save all website files directly in output_dir
        restorer = WaybackRestore(
            domain=domain,
            timestamp=timestamp,
            output_dir=output_dir,
            headless_render=headless_render
        )

        # Perform the restoration
        restorer.restore(max_pages=max_pages)

        # Add README in the same directory where website files are
        generate_readme(output_dir)

        # Create zip archive from the output directory
        zip_path = f"{id}.zip"
        shutil.make_archive(id, "zip", output_dir)

        # Upload to s3 + get URL
        s3Url = s3_upload(zip_path)

        # Delete zip file
        os.remove(zip_path)

        # Delete restored files (but keep the output directory itself)
        for item in os.listdir(output_dir):
            item_path = os.path.join(output_dir, item)
            if os.path.isfile(item_path) or os.path.islink(item_path):
                os.unlink(item_path)
            elif os.path.isdir(item_path):
                shutil.rmtree(item_path)

        # Update database
        update_db(session, 4, id, s3Url)
    except Exception as exception:
        logger.error("Exception: %s", exception)
        update_db(session, 5, id)


def run():
    """Main run method"""
    try:
        logger.info("Starting wayback-restore")

        while True:
            message = receive_message()
            if message is not None:
                session = get_db_session()
                client = json.loads(message["Body"])
                timestamp = message["MessageAttributes"]["timestamp"]["StringValue"]
                domain = message["MessageAttributes"]["domain"]["StringValue"]
                action = message["MessageAttributes"]["action"]["StringValue"]
                id = message["MessageAttributes"]["id"]["StringValue"]

                if action == "restore":
                    restore(session,
                            id=id,
                            domain=domain,
                            timestamp=timestamp,
                            headless_render=True,
                            max_pages=100
                            )
                elif action == "resend":
                    s3Url = get_s3_url(session, id)

                    # Send email
                    if s3Url is not None:
                        send_email(client["email"], s3Url=s3Url)
                    else:
                        logger.error("Unable to get s3Url for ID: ", id)
                else:
                    logger.error("Invalid action: ", action)

                # Close DB session
                session.close()

    except KeyboardInterrupt:
        logger.info("Stopping service...")


if __name__ == "__main__":
    run()