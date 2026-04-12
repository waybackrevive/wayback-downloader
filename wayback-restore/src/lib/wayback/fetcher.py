"""
HTTP fetching utilities with retry logic for Wayback Machine restoration.
"""
import time
import random
import logging
import requests
from typing import Optional, Set

logger = logging.getLogger(__name__)

class Fetcher:
    """HTTP fetcher with retry logic and rate limiting."""
    def __init__(self, max_retries: int = 3, min_request_interval: int = 1,
                 max_request_interval: int = 5, backoff_factor: float = 1.5):
        """
        Initialize the fetcher.

        Args:
            max_retries: Maximum number of retry attempts for failed requests
            min_request_interval: Minimum seconds between requests
            max_request_interval: Maximum seconds to wait between requests
            backoff_factor: Multiplier for exponential backoff
        """
        self.max_retries = max_retries
        self.min_request_interval = min_request_interval
        self.max_request_interval = max_request_interval
        self.backoff_factor = backoff_factor
        self.last_request_time = time.time()
        self.failed_urls: Set[str] = set()

        # Initialize session
        self.session = requests.Session()
        self.session.headers.update({'User-Agent': 'waybackrestore/1.0'})

    def _sleep_if_needed(self):
        """Sleep if necessary to respect rate limiting."""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time

        if time_since_last < self.min_request_interval:
            sleep_time = random.uniform(self.min_request_interval, self.max_request_interval)
            time.sleep(sleep_time)

        self.last_request_time = time.time()

    def fetch_with_retry(self, url: str, retries: int = 0) -> Optional[requests.Response]:
        """
        Fetch a URL with retry logic for failed requests.
        Also detects and skips non-archived pages.

        Args:
            url: URL to fetch
            retries: Current retry count

        Returns:
            Response object or None if all retries failed or page not archived
        """
        self._sleep_if_needed()

        try:
            logger.info(f"Fetching: {url}")
            response = self.session.get(url, timeout=60)

            # Check if this is a "not archived" page
            if response.status_code == 200 and 'text/html' in response.headers.get('Content-Type', ''):
                html_content = response.text

                not_archived_patterns = [
                    "The Wayback Machine has not archived that URL",
                    "Page cannot be displayed due to robots.txt",
                    "This URL has been excluded from the Wayback Machine",
                    "not in the Wayback Machine"
                ]

                for pattern in not_archived_patterns:
                    if pattern in html_content:
                        logger.warning(f"URL was not archived in the Wayback Machine: {url}")
                        self.failed_urls.add(url)
                        return None

                if "<h2>Hrm." in html_content and "The Wayback Machine" in html_content:
                    logger.warning(f"URL was not archived (standard error page): {url}")
                    self.failed_urls.add(url)
                    return None

                if "<title>Internet Archive Wayback Machine</title>" in html_content and "Click here to search for all archived pages" in html_content:
                    logger.warning(f"URL was not archived (generic error page): {url}")
                    self.failed_urls.add(url)
                    return None

            response.raise_for_status()
            return response

        except requests.exceptions.HTTPError as e:
            if e.response is not None and e.response.status_code == 404:
                logger.warning(f"404 Not Found, skipping retries: {url}")
                self.failed_urls.add(url)
                return None
            raise

        except requests.exceptions.RequestException as e:
            if retries < self.max_retries:
                logger.warning(f"Retrying {url} (attempt {retries + 1}/{self.max_retries}): {e}")
                time.sleep((self.backoff_factor ** retries) * self.max_request_interval)
                return self.fetch_with_retry(url, retries + 1)
            logger.error(f"Failed to fetch {url}: {e}")
            self.failed_urls.add(url)
            return None