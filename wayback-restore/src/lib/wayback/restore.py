"""
Main WaybackRestore class that orchestrates website restoration.
"""
import os
import re
import logging
from urllib.parse import urlparse
from typing import List, Set, Optional
from bs4 import BeautifulSoup
from .config import (
WAYBACK_ROOT, DEFAULT_DIRECTORIES, BINARY_EXTENSIONS
)
from .url_utils import URLUtils
from .fetcher import Fetcher
from .file_manager import FileManager
from .browser import HeadlessBrowser
from .content_processor import ContentProcessor

logger = logging.getLogger(__name__)

class WaybackRestore:
    """
    Main class for restoring websites from the Wayback Machine archive.
    """
    def __init__(self, domain: str, timestamp: str, output_dir: str, max_retries: int = 3,
                 directories: dict = None, removal_patterns: list = None,
                 related_domains: list = None, max_request_interval: int = 5,
                 headless_render: bool = False):
        """
        Initialize a WaybackRestore instance.

        Args:
            domain: The domain to restore (e.g., 'example.com')
            timestamp: The Wayback Machine timestamp (e.g., '20200101120000')
            output_dir: Directory where the restored site will be saved
            max_retries: Maximum number of retry attempts for failed requests
            directories: Dictionary of directory names for assets
            removal_patterns: List of regex patterns to remove Wayback artifacts
            related_domains: List of related domains (CDNs, etc.) to include in restoration
            max_request_interval: Maximum seconds to wait between requests
            headless_render: Whether to use headless browser rendering
        """
        # Normalize domain
        if '://' in domain:
            self.domain = domain.split('://', 1)[1].rstrip('/')
        else:
            self.domain = domain.rstrip('/')

        self.timestamp = timestamp
        self.headless_render = headless_render

        # Check for environment variable for output directory
        env_output_dir = os.environ.get('WAYBACK_OUTPUT_DIR')
        if env_output_dir:
            self.output_dir = env_output_dir
            logger.info(f"Using output directory from environment variable: {self.output_dir}")
        else:
            self.output_dir = output_dir
            logger.info(f"Using provided output directory: {self.output_dir}")

        # Ensure the output directory is an absolute path
        if not os.path.isabs(self.output_dir):
            self.output_dir = os.path.abspath(self.output_dir)
            logger.info(f"Converted to absolute path: {self.output_dir}")

        # List of related domains to also download (like CDNs)
        self.related_domains = related_domains or []

        # Auto-detection settings
        self.auto_detect_domains = True
        self.max_detected_domains = 20
        self.detected_domains: Set[str] = set()

        # Tracking state
        self.visited_urls: Set[str] = set()
        self.failed_urls: Set[str] = set()

        # Initialize components
        self.directories = directories or DEFAULT_DIRECTORIES.copy()

        self.url_utils = URLUtils(
            domain=self.domain,
            timestamp=self.timestamp,
            related_domains=self.related_domains,
            detected_domains=self.detected_domains
        )

        self.fetcher = Fetcher(
            max_retries=max_retries,
            max_request_interval=max_request_interval
        )

        self.file_manager = FileManager(
            domain=self.domain,
            output_dir=self.output_dir,
            directories=self.directories,
            related_domains=self.related_domains,
            detected_domains=self.detected_domains
        )

        self.content_processor = ContentProcessor(
            url_utils=self.url_utils,
            file_manager=self.file_manager,
            headless_render=headless_render
        )

        # Initialize headless browser if needed
        self.browser: Optional[HeadlessBrowser] = None
        if self.headless_render:
            self.browser = HeadlessBrowser(self.output_dir)
            if not self.browser.initialize():
                logger.error("Failed to initialize headless browser. Falling back to standard mode.")
                self.headless_render = False
                self.browser = None

        # Add custom removal patterns
        if removal_patterns:
            from .config import get_removal_patterns
            for pattern in removal_patterns:
                self.content_processor.removal_patterns.append(
                    re.compile(pattern, re.DOTALL | re.IGNORECASE)
                )


    def _process_and_save_resource(self, url: str) -> List[str]:
        """
        Process and save a resource from the Wayback Machine.

        Args:
            url: URL to process

        Returns:
            List of new URLs discovered that need to be crawled
        """
        # Skip already visited URLs
        if url in self.visited_urls:
            return []

        # Check for equivalent URLs
        for visited_url in self.visited_urls:
            if self.url_utils.is_equivalent_url(url, visited_url):
                logger.info(f"Skipping equivalent URL: {url}")
                return []

        # Preprocess font URLs
        url = self._preprocess_font_url(url)

        # Mark as visited early to prevent re-processing
        self.visited_urls.add(url)

        # Get Wayback URL
        wayback_url = self.url_utils.get_wayback_url(url)

        # Fetch content
        content, content_type = self._fetch_content(url, wayback_url)
        if content is None:
            return []

        # Get local path after successful fetch
        local_path, _ = self.file_manager.get_local_path(url)

        # Check for duplicate local paths
        if local_path in self.file_manager.local_path_to_url:
            existing_url = self.file_manager.local_path_to_url[local_path]
            if existing_url != url:
                logger.info(f"Skipping {url} - would overwrite file from {existing_url}")
                return []

        # Update local path if extension was inferred
        url, local_path = self._update_path_if_needed(url, content_type, local_path)

        # Check again for duplicate paths after update
        if local_path in self.file_manager.local_path_to_url:
            existing_url = self.file_manager.local_path_to_url[local_path]
            if existing_url != url:
                logger.info(f"Skipping {url} - would overwrite file from {existing_url}")
                return []

        extension = os.path.splitext(local_path)[1].lower()

        # Process content
        new_urls = []
        is_binary = extension in BINARY_EXTENSIONS

        if not is_binary:
            try:
                if 'text/html' in content_type or extension == '.html':
                    processed_content, discovered_urls = self.content_processor.process_html(
                        content, url, self.visited_urls
                    )
                    new_urls.extend(discovered_urls)
                    content = processed_content
                elif 'text/css' in content_type or extension == '.css':
                    css_str = content.decode('utf-8', errors='replace')
                    css_content, css_urls = self.content_processor.process_css(css_str, url, url)
                    new_urls.extend(css_urls)
                    content = css_content.encode('utf-8')
                elif 'javascript' in content_type or extension == '.js':
                    try:
                        js_str = content.decode('utf-8', errors='replace')
                        js_content, js_urls = self.content_processor.process_js(js_str, url, url)
                        new_urls.extend(js_urls)
                        content = js_content.encode('utf-8')
                    except Exception as e:
                        logger.warning(f"Error processing JavaScript {url}: {e}")
                else:
                    content = self.content_processor.clean_content(content)
            except UnicodeDecodeError:
                pass

        # Write file
        self.file_manager.write_file(local_path, content)
        
        logger.info(f"Successfully saved: {url} -> {local_path}")

        return new_urls

    def _preprocess_font_url(self, url: str) -> str:
        """Preprocess font URLs to fix common issues."""
        try:
            parsed = urlparse(url)
            if parsed.netloc and parsed.path and '/' in parsed.path:
                domain = parsed.netloc
                path = parsed.path.lstrip('/')

                is_font = (any(ext in path.lower() for ext in ['.woff', '.woff2', '.ttf', '.otf', '.eot']) or
                           '/fonts/' in path.lower() or '/font/' in path.lower() or
                           any(font_name in path.lower() for font_name in ['fontawesome', 'font-awesome', 'webfont']))

                if is_font:
                    if path.startswith(domain + '/') or path == domain:
                        new_path = path[len(domain):].lstrip('/')
                        fixed_url = parsed._replace(path='/' + new_path if new_path else '/').geturl()
                        logger.info(f"Fixed duplicate domain in font URL: {fixed_url}")
                        return fixed_url
        except Exception as e:
            logger.warning(f"Error preprocessing font URL: {e}")
        return url

    def _fetch_content(self, url: str, wayback_url: str) -> tuple:
        """Fetch content from Wayback Machine."""
        content = None
        content_type = None

        if self.headless_render and self.browser and (url.endswith('.html') or not os.path.splitext(url)[1]):
            logger.info(f"Using headless browser to render: {wayback_url}")
            rendered_html = self.browser.render_page(wayback_url)

            if rendered_html:
                if rendered_html.strip() == "":
                    logger.warning(f"Page was not archived: {wayback_url}")
                    self.failed_urls.add(url)
                    return None, None

                content = rendered_html.encode('utf-8')
                content_type = 'text/html'
            else:
                logger.warning(f"Headless rendering failed for {url}, falling back to regular fetch")
                return self._regular_fetch(url, wayback_url)
        else:
            return self._regular_fetch(url, wayback_url)

        return content, content_type

    def _regular_fetch(self, url: str, wayback_url: str) -> tuple:
        """Regular HTTP fetch."""
        response = self.fetcher.fetch_with_retry(wayback_url)

        if not response:
            logger.warning(f"Failed to fetch or URL not archived: {wayback_url}")
            self.failed_urls.add(url)
            return None, None

        content = response.content
        content_type = response.headers.get('Content-Type', '').split(';')[0].lower()

        if 'text/html' in content_type:
            try:
                html_content = content.decode('utf-8', errors='replace')
                if "The Wayback Machine has not archived that URL" in html_content or "<h2>Hrm." in html_content:
                    logger.warning(f"Page was not archived: {wayback_url}")
                    self.failed_urls.add(url)
                    return None, None
            except Exception as e:
                logger.warning(f"Error checking HTML content: {e}")

        return content, content_type

    def _update_path_if_needed(self, url: str, content_type: str, local_path: str) -> tuple:
        """Update URL and path if extension was inferred from content type."""
        inferred_extension = None
        if 'text/html' in content_type:
            inferred_extension = '.html'
        elif 'text/css' in content_type:
            inferred_extension = '.css'
        elif 'javascript' in content_type:
            inferred_extension = '.js'
        elif 'image/jpeg' in content_type:
            inferred_extension = '.jpg'
        elif 'image/png' in content_type:
            inferred_extension = '.png'
        elif 'image/gif' in content_type:
            inferred_extension = '.gif'
        elif 'image/svg+xml' in content_type:
            inferred_extension = '.svg'

        parsed_url = urlparse(url)
        path = parsed_url.path
        if inferred_extension and not os.path.splitext(path)[1] and path.strip('/'):
            new_path = path + inferred_extension
            modified_url = parsed_url._replace(path=new_path).geturl()

            if url in self.file_manager.url_to_local_path:
                old_path = self.file_manager.url_to_local_path[url]
                if old_path in self.file_manager.local_path_to_url:
                    del self.file_manager.local_path_to_url[old_path]
                    del self.file_manager.url_to_local_path[url]
                    url = modified_url
                    local_path, _ = self.file_manager.get_local_path(url)

        return url, local_path

    def crawl_and_download(self, max_pages: int, max_assets: int) -> None:
        """
        Crawl and download the website from the Wayback Machine.

        Args:
            max_pages: Maximum number of pages to download
        """
        url = f"https://{self.domain}/" if '://' not in self.domain else self.domain
        queue = [url]
        asset_queue = []
        cdn_queue = []
        page_count = 0
        assets_count = 0

        logger.info(f"Starting restoration of {self.domain} from timestamp {self.timestamp}")
        logger.info(f"Output directory: {self.output_dir}")
        logger.info(f"Related domains: {self.related_domains}")
        logger.info(f"Headless rendering enabled: {self.headless_render}")

        while (queue or asset_queue or cdn_queue) and (page_count < max_pages or assets_count < max_assets):
            if queue and page_count < max_pages:
                url = queue.pop(0)
                is_asset = False
                asset_type = "page"
            elif cdn_queue and assets_count < max_assets:
                url = cdn_queue.pop(0)
                is_asset = True
                asset_type = "cdn"
            elif asset_queue and assets_count < max_assets:
                url = asset_queue.pop(0)
                is_asset = True
                asset_type = "asset"
            else:
                break

            logger.info(f"Processing {asset_type}: {url}")
            new_urls = self._process_and_save_resource(url)

            for new_url in new_urls:
                # Skip invalid URLs
                if not new_url or not isinstance(new_url, str):
                    continue
                    
                if new_url not in self.visited_urls and new_url not in queue and new_url not in asset_queue and new_url not in cdn_queue:
                    if 'archive.org' in new_url or 'web.archive.org' in new_url:
                        continue

                    parsed = urlparse(new_url)
                    domain = parsed.netloc

                    if 'archive.org' in domain or 'web.archive.org' in domain:
                        continue

                    path = parsed.path.lower()

                    is_cdn_domain = any(cdn_term in domain.lower() for cdn_term in [
                        'cdn', 'static', 'assets', 'media', 'img', 'images'
                    ]) or domain in self.related_domains or domain in self.detected_domains

                    # Determine if this is an HTML page or asset
                    # HTML pages should go to main queue for crawling
                    is_html_page = (
                        path.endswith(('.html', '.htm', '.php', '.asp', '.aspx', '.jsp', '.cfm', '.cgi')) or
                        (not os.path.splitext(path)[1] and '.' not in os.path.basename(path) and not is_cdn_domain)
                    )

                    # Check for definite asset extensions
                    is_asset_url = path.endswith((
                        '.css', '.scss', '.less',
                        '.js', '.jsx', '.ts', '.json',
                        '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', '.bmp', '.tiff',
                        '.woff', '.woff2', '.ttf', '.otf', '.eot',
                        '.mp4', '.webm', '.ogg', '.avi', '.mov',
                        '.mp3', '.wav', '.pdf', '.zip', '.rar'
                    ))

                    # Check path patterns only if not already classified
                    if not is_asset_url and not is_html_page:
                        asset_patterns = ['/css/', '/js/', '/img/', '/images/', '/fonts/', '/assets/', '/static/', '/media/']
                        is_asset_url = any(pattern in path.lower() for pattern in asset_patterns)

                    # Check for equivalent URLs
                    is_in_queue = False
                    for q in (queue, asset_queue, cdn_queue):
                        for existing_url in q:
                            if self.url_utils.is_equivalent_url(new_url, existing_url):
                                is_in_queue = True
                                break
                        if is_in_queue:
                            break

                    if is_in_queue:
                        continue

                    # HTML pages go to main queue, not asset queue
                    if is_html_page and not is_cdn_domain:
                        queue.append(new_url)
                        logger.debug(f"Added HTML page to main queue: {new_url}")
                    elif is_asset_url and is_cdn_domain:
                        cdn_queue.append(new_url)
                    elif is_asset_url or is_cdn_domain:
                        asset_queue.append(new_url)
                    else:
                        queue.append(new_url)

            if is_asset:
                assets_count += 1
                if assets_count % 20 == 0:
                    logger.info(f"Processed {assets_count} assets - Remaining: {len(asset_queue) + len(cdn_queue)}")
            else:
                page_count += 1
                logger.info(f"Processed {page_count}/{max_pages} pages - Remaining: {len(queue)}")

        # Generate statistics
        self._log_statistics(page_count, assets_count)

    def _log_statistics(self, page_count: int, assets_count: int) -> None:
        """Log restoration statistics."""
        file_types = {}
        for filepath in self.file_manager.local_path_to_url.keys():
            ext = os.path.splitext(filepath)[1].lower()
            file_types[ext] = file_types.get(ext, 0) + 1

        logger.info(f"Restoration complete. Processed {page_count} pages and {assets_count} assets.")
        logger.info(f"Total files downloaded: {len(self.file_manager.local_path_to_url)}")
        logger.info(f"Failed URLs: {len(self.failed_urls)}")

        logger.info("Files by type:")
        for ext, count in sorted(file_types.items(), key=lambda x: x[1], reverse=True):
            logger.info(f"  {ext or 'No extension'}: {count}")

        # Write reports
        self._write_failed_urls_report()
        self._write_downloaded_files_report()

    def _write_failed_urls_report(self) -> None:
        """Write failed URLs report."""
        if self.failed_urls:
            report_path = os.path.join(self.output_dir, "failed_urls.txt")
            try:
                with open(report_path, 'w') as f:
                    for url in sorted(self.failed_urls):
                        f.write(f"{url}\n")
                logger.info(f"Failed URLs saved to {report_path}")
            except Exception as e:
                logger.error(f"Error writing failed URLs report: {e}")

    def _write_downloaded_files_report(self) -> None:
        """Write downloaded files report."""
        report_path = os.path.join(self.output_dir, "downloaded_files.txt")
        try:
            with open(report_path, 'w') as f:
                f.write(f"# Downloaded Files Report\n")
                f.write(f"Domain: {self.domain}\n")
                f.write(f"Timestamp: {self.timestamp}\n")
                f.write(f"Total files: {len(self.file_manager.local_path_to_url)}\n\n")
                f.write(f"## Files by original URL\n\n")

                for local_path, url in sorted(self.file_manager.local_path_to_url.items()):
                    rel_path = os.path.relpath(local_path, self.output_dir)
                    f.write(f"{rel_path} <= {url}\n")

            logger.info(f"Downloaded files report saved to {report_path}")
        except Exception as e:
            logger.error(f"Error writing downloaded files report: {e}")

    def extract_related_domains_from_homepage(self) -> List[str]:
        """
        Extract related domains from the homepage before starting the crawl.

        Returns:
            List of related domains
        """
        url = f"https://{self.domain}/" if '://' not in self.domain else self.domain
        wayback_url = self.url_utils.get_wayback_url(url)

        try:
            html_content = ""

            if self.headless_render and self.browser:
                logger.info(f"Using headless browser to extract domains from homepage")
                rendered_html = self.browser.render_page(wayback_url)

                if rendered_html:
                    html_content = rendered_html
                else:
                    response = self.fetcher.fetch_with_retry(wayback_url)
                    if not response:
                        return []
                    html_content = response.content.decode('utf-8', errors='replace')
            else:
                response = self.fetcher.fetch_with_retry(wayback_url)
                if not response:
                    return []
                html_content = response.content.decode('utf-8', errors='replace')

            domains = self._extract_domains_from_html(html_content, url)
            logger.info(f"Found {len(domains)} domains in homepage")

            related = self._detect_related_domains(domains)

            # Additional CDN detection
            additional_related = []
            domain_parts = self.domain.split('.')
            domain_name = domain_parts[0] if len(domain_parts) >= 1 else ""
            
            for domain in domains:
                if domain_name.lower() in domain.lower():
                    if any(pattern in domain.lower() for pattern in [
                        'cdn', 'static', 'assets', 'media', 'img', 'images',
                        'storage', 's3.', 'cloudfront', 'cloudflare', 'b-cdn'
                    ]):
                        additional_related.append(domain)

            all_related = list(set(related + additional_related))
            logger.info(f"Detected related domains: {all_related}")

            return all_related
        except Exception as e:
            logger.error(f"Error detecting related domains: {e}")
            return []

    def _extract_domains_from_html(self, html_content: str, base_url: str) -> List[str]:
        """Extract all domains referenced in HTML content."""
        domains = set()
        try:
            soup = BeautifulSoup(html_content, 'lxml')

            for tag, attrs in [
                ('a', 'href'), ('img', 'src'), ('script', 'src'),
                ('link', 'href'), ('source', 'src'), ('iframe', 'src'),
                ('video', 'src'), ('audio', 'src')
            ]:
                for element in soup.find_all(tag, **{attrs: True}):
                    attr_value = element[attrs]

                    if attr_value.startswith(('mailto:', 'tel:', '#', 'javascript:', 'data:')):
                        continue

                    try:
                        if attr_value.startswith(WAYBACK_ROOT):
                            orig_url, _ = self.url_utils.extract_original_url(attr_value)
                            if orig_url:
                                attr_value = orig_url

                        from urllib.parse import urljoin
                        full_url = urljoin(base_url, attr_value)
                        parsed = urlparse(full_url)

                        if parsed.netloc and parsed.scheme in ('http', 'https'):
                            domains.add(parsed.netloc)
                    except Exception:
                        pass

        except Exception as e:
            logger.error(f"Error extracting domains from HTML: {e}")

        return list(domains)

    def _detect_related_domains(self, domains: List[str]) -> List[str]:
        """Detect related domains that should be included."""
        related = []
        main_domain_parts = self.domain.split('.')

        for domain in domains:
            if domain == self.domain:
                continue

            if 'archive.org' in domain or 'web.archive.org' in domain:
                continue

            if any(cdn in domain for cdn in ['cdn', 'static', 'assets', 'media', 'img', 'images']):
                related.append(domain)
                continue

            domain_parts = domain.split('.')
            if len(domain_parts) >= 2 and len(main_domain_parts) >= 2:
                if domain_parts[-1] == main_domain_parts[-1] and domain_parts[-2] == main_domain_parts[-2]:
                    related.append(domain)

        return related

    def _check_missing_resources(self) -> None:
        """Check for missing resources in HTML files."""
        logger.info("Checking for missing resources...")
        html_files = []

        for root, _, files in os.walk(self.output_dir):
            for file in files:
                if file.endswith('.html'):
                    html_files.append(os.path.join(root, file))

        logger.info(f"Found {len(html_files)} HTML files to check")
        missing_resources = set()

        for html_file in html_files:
            try:
                with open(html_file, 'r', encoding='utf-8', errors='replace') as f:
                    content = f.read()

                soup = BeautifulSoup(content, 'lxml')

                for tag, attrs in [
                    ('img', 'src'), ('script', 'src'),
                    ('link', 'href'), ('source', 'src'),
                    ('audio', 'src'), ('video', 'src')
                ]:
                    for element in soup.find_all(tag, **{attrs: True}):
                        attr_value = element[attrs]

                        if attr_value.startswith(('data:', '#', 'javascript:')):
                            continue

                        if not attr_value.startswith(('http://', 'https://')):
                            resource_path = os.path.normpath(os.path.join(os.path.dirname(html_file), attr_value))

                            if not os.path.exists(resource_path):
                                if '.' in attr_value and '/' in attr_value and not attr_value.startswith('/'):
                                    domain_part = attr_value.split('/', 1)[0]
                                    if '.' in domain_part:
                                        missing_url = f"https://{attr_value}"
                                        missing_resources.add(missing_url)
            except Exception as e:
                logger.error(f"Error checking HTML file {html_file}: {e}")

        if missing_resources:
            logger.info(f"Attempting to download {len(missing_resources)} missing resources")
            for url in missing_resources:
                try:
                    self._process_and_save_resource(url)
                except Exception as e:
                    logger.error(f"Error downloading missing resource {url}: {e}")

        logger.info("Finished checking for missing resources")

    def _create_summary_report(self) -> None:
        """Create a summary report of the restoration."""
        report_path = os.path.join(self.output_dir, "restoration_report.html")

        try:
            file_counts = {}
            for filepath in self.file_manager.local_path_to_url.keys():
                ext = os.path.splitext(filepath)[1].lower()
                file_counts[ext] = file_counts.get(ext, 0) + 1

            with open(report_path, 'w') as f:
                f.write(f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Wayback Restoration Report</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; }}
        h1, h2 {{ color: #333; }}
        .summary {{ background-color: #f5f5f5; padding: 15px; border-radius: 5px; }}
        table {{ border-collapse: collapse; width: 100%; margin-top: 20px; }}
        th, td {{ text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }}
        th {{ background-color: #f2f2f2; }}
    </style>
</head>
<body>
    <h1>Wayback Machine Restoration Report</h1>
    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Domain:</strong> {self.domain}</p>
        <p><strong>Timestamp:</strong> {self.timestamp}</p>
        <p><strong>Output directory:</strong> {self.output_dir}</p>
        <p><strong>Total URLs processed:</strong> {len(self.visited_urls)}</p>
        <p><strong>Failed URLs:</strong> {len(self.failed_urls)}</p>
        <p><strong>Related domains:</strong> {', '.join(sorted(self.related_domains + list(self.detected_domains)))}</p>
    </div>
    
    <h2>Files by Type</h2>
    <table>
        <tr>
            <th>File Type</th>
            <th>Count</th>
        </tr>
""")

                # Write file type rows
                for ext, count in sorted(file_counts.items(), key=lambda x: x[1], reverse=True):
                    f.write(f"        <tr>\n            <td>{ext or 'No extension'}</td>\n            <td>{count}</td>\n        </tr>\n")
                
                # Close the table and HTML
                f.write("""    </table>
    <h2>Usage</h2>
    <p>Open <code>index.html</code> in a web browser to view the restored site.</p>
</body>
</html>""")
            logger.info(f"Restoration report saved to {report_path}")

        except Exception as e:
            logger.error(f"Error creating summary report: {e}")

    def restore(self, max_pages: int = 100, max_assets: int = 500, auto_detect_domains: bool = True) -> None:
        """
        Restore a website from the Wayback Machine.

        Args:
            max_pages: Maximum number of pages to download
            max_assets: Maximum number of assets to download
            auto_detect_domains: Whether to auto-detect related domains
        """
        try:
            logger.info(f"Starting restoration of {self.domain} with timestamp {self.timestamp}")
            logger.info(f"Auto-detect domains: {auto_detect_domains}")

            if auto_detect_domains:
                detected = self.extract_related_domains_from_homepage()

                new_domains = [d for d in detected if d not in self.related_domains]
                self.related_domains.extend(new_domains)
                self.detected_domains.update(detected)

                # Update components with new domains
                self.url_utils.related_domains = self.related_domains
                self.url_utils.detected_domains = self.detected_domains
                self.file_manager.related_domains = self.related_domains
                self.file_manager.detected_domains = self.detected_domains

                logger.info(f"Added {len(new_domains)} detected domains: {new_domains}")

            all_domains = list(set(self.related_domains) | self.detected_domains)
            logger.info(f"All domains being processed ({len(all_domains)}): {all_domains}")

            self.crawl_and_download(max_pages, max_assets)

            self._check_missing_resources()
            self._create_summary_report()

            logger.info(f"Restoration completed successfully for {self.domain}")

            if self.browser:
                self.browser.close()

        except Exception as e:
            logger.error(f"Error during restoration: {e}")
            import traceback
            logger.error(traceback.format_exc())

            if self.browser:
                self.browser.close()