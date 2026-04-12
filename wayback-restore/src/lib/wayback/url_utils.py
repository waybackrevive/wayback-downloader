"""
URL handling utilities for Wayback Machine restoration.
"""

import re
import logging
from urllib.parse import urlparse, urljoin
from typing import Tuple, List, Set

from .config import (
    WAYBACK_ROOT, WAYBACK_MODIFIERS, EXTERNAL_CDN_DOMAINS,
    EXTERNAL_CDN_PATTERNS
)

logger = logging.getLogger(__name__)


class URLUtils:
    """Utility class for URL manipulation and validation."""
    
    def __init__(self, domain: str, timestamp: str, related_domains: List[str] = None,
                 detected_domains: Set[str] = None):
        """
        Initialize URL utilities.
        
        Args:
            domain: The main domain being restored
            timestamp: Wayback Machine timestamp
            related_domains: List of related domains (CDNs, etc.)
            detected_domains: Set of auto-detected domains
        """
        self.domain = domain
        self.timestamp = timestamp
        self.related_domains = related_domains or []
        self.detected_domains = detected_domains or set()
        self.wayback_root = WAYBACK_ROOT
        self.wayback_modifiers = WAYBACK_MODIFIERS
        
        # Extract domain name for CDN detection
        domain_parts = self.domain.split('.')
        self.domain_name = domain_parts[0] if len(domain_parts) >= 1 else ""
        
        # Compile regex for finding Wayback URLs
        self.wayback_url_regex = re.compile(
            r'https?://web\.archive\.org/web/\d+(?:' +
            '|'.join(self.wayback_modifiers) +
            r')?/(?:https?:)?//([^/]+)(.*)'
        )

    def extract_original_url(self, wayback_url: str) -> Tuple[str, str]:
        """
        Extract the original URL from a Wayback Machine URL.

        Args:
            wayback_url: Wayback Machine URL

        Returns:
            Tuple of (original_url, timestamp)
        """
        original_url = ""
        timestamp = ""

        # Handle relative Wayback URLs (starting with /web/)
        if wayback_url.startswith('/web/'):
            # Check for Wayback's resource type modifiers (cs_, js_, jm_, im_, etc.)
            resource_pattern = r'^/web/(\d+)((?:cs_|js_|jm_|im_|if_|fw_|id_)?)/(https?://)?(.+)$'
            resource_match = re.match(resource_pattern, wayback_url)
            
            if resource_match:
                logger.debug(f"Matched resource URL pattern in: {wayback_url}")
                timestamp = resource_match.group(1)
                modifier = resource_match.group(2)
                protocol = resource_match.group(3) or 'https://'
                if not protocol.endswith('://'):
                    protocol += '://'
                path = resource_match.group(4)
                
                # Remove any duplicate protocol
                if path.startswith(('http://', 'https://')):
                    original_url = path
                else:
                    original_url = protocol + path
                
                logger.debug(f"Extracted from resource URL: {original_url} (timestamp: {timestamp}, modifier: {modifier})")
                return original_url, timestamp
            
            # Convert to full Wayback URL if not matched above
            wayback_url = f"{self.wayback_root}{wayback_url}"
            logger.debug(f"Converted relative Wayback URL to: {wayback_url}")

        # Handle various Wayback URL formats
        if wayback_url.startswith(self.wayback_root) or '/web/' in wayback_url:
            # Extract the timestamp
            match = re.search(r'/web/(\d+)(?:[a-z]{2}_)?/', wayback_url)
            if match:
                timestamp = match.group(1)

            # Extract the original URL
            for modifier in [''] + self.wayback_modifiers:
                pattern = f"/web/\\d+{modifier}/"
                match = re.search(pattern, wayback_url)
                if match:
                    end_pos = match.end()
                    original_url = wayback_url[end_pos:]
                    
                    # Special handling for mailto: links
                    if original_url.startswith(('mailto:', 'tel:')):
                        return original_url, timestamp
                    
                    # If it's a Wayback Machine version of a mailto link, extract just the mailto part
                    if 'mailto:' in original_url:
                        mail_match = re.search(r'(?:https?:)?//[^/]+/mailto:(.*)', original_url)
                        if mail_match:
                            return 'mailto:' + mail_match.group(1), timestamp
                    
                    # Handle double slashes in URLs (common in Wayback)
                    original_url = self._fix_protocol_issues(original_url)
                    
                    # Handle domain repeated in the path (common in Wayback)
                    domain_match = re.match(r'(https?://[^/]+)/+\1', original_url)
                    if domain_match:
                        original_url = domain_match.group(1) + original_url[len(domain_match.group(0)):]
                    
                    # Check for embedded domains in the path
                    if self._has_embedded_domain(original_url):
                        return "", timestamp
                    
                    break

        return original_url, timestamp

    def _fix_protocol_issues(self, url: str) -> str:
        """Fix common protocol issues in URLs."""
        if url.startswith('http://http://'):
            return url[7:]
        elif url.startswith('https://https://'):
            return url[8:]
        elif url.startswith('http://https://'):
            return url[7:]
        elif url.startswith('https://http://'):
            return url[8:]
        elif url.startswith('//'):
            return 'https:' + url
        elif url.startswith('https/'):
            return 'https://' + url[6:]
        elif url.startswith('http/'):
            return 'http://' + url[5:]
        return url

    def _has_embedded_domain(self, url: str) -> bool:
        """Check if URL has an embedded domain in the path."""
        try:
            parsed = urlparse(url)
            main_domain = parsed.netloc
            path_parts = parsed.path.split('/')
            
            for part in path_parts:
                if not part:
                    continue
                if '.' in part and len(part) > 4:
                    if any(tld in part.lower() for tld in ['.com', '.org', '.net', '.io', '.co', '.gov']):
                        if part != main_domain and not part.endswith(main_domain):
                            return True
        except Exception:
            pass
        return False

    def is_external_cdn_resource(self, url: str) -> bool:
        """
        Check if a URL is from an external CDN that should be preserved as-is.
        
        Args:
            url: URL to check
            
        Returns:
            True if the URL is from an external CDN like Google Fonts
        """
        try:
            parsed = urlparse(url)
            domain = parsed.netloc.lower()
            
            # Check for exact domain matches
            if domain in EXTERNAL_CDN_DOMAINS:
                return True
                
            # Check for domain pattern matches
            if any(domain.startswith(pattern) for pattern in EXTERNAL_CDN_PATTERNS) and any(
                ext_domain in domain for ext_domain in ['google', 'cloudflare', 'bootstrapcdn']
            ):
                return True
                
            return False
        except Exception as e:
            logger.error(f"Error checking if URL is external CDN resource: {e}")
            return False

    def is_same_domain_or_related(self, url: str) -> bool:
        """
        Check if a URL belongs to the main domain or related domains.

        Args:
            url: URL to check

        Returns:
            True if the URL belongs to the main domain or related domains
        """
        try:
            # Skip mailto:, tel:, etc.
            if 'mailto:' in url or 'tel:' in url:
                return False
                
            # Skip Cloudflare email protection and CDN injected scripts
            if 'cdn-cgi/l/email-protection' in url or 'cdn-cgi/scripts' in url or 'cloudflare-static/email-decode' in url:
                return False
                
            # Explicitly exclude archive.org and web.archive.org domains
            if 'archive.org' in url or 'web.archive.org' in url:
                return False
                
            parsed = urlparse(url)
            domain = parsed.netloc
            if not domain:
                return False
                
            # Explicitly exclude archive.org domains
            if 'archive.org' in domain or 'web.archive.org' in domain:
                return False
            
            # Explicitly exclude common CDN and font domains that should remain external
            if domain.lower() in EXTERNAL_CDN_DOMAINS:
                return False
                
            # Also match domain patterns for external resources
            if any(domain.lower().startswith(pattern) for pattern in EXTERNAL_CDN_PATTERNS) and any(
                ext_domain in domain.lower() for ext_domain in ['google', 'cloudflare', 'bootstrapcdn']
            ):
                return False
                
            # Check for embedded domains in the path
            path_parts = parsed.path.split('/')
            for part in path_parts:
                if not part:
                    continue
                if '.' in part and len(part) > 4:
                    if any(tld in part.lower() for tld in ['.com', '.org', '.net', '.io', '.co', '.gov']):
                        return False

            # Check the main domain
            if domain == self.domain or domain.endswith('.' + self.domain):
                return True

            # Enhanced CDN domain detection
            main_name = self.domain_name.lower()
            
            # Match domain name part in CDN domains
            if main_name and main_name in domain.lower():
                is_cdn = any(cdn_indicator in domain.lower() for cdn_indicator in [
                    'cdn', 'static', 'assets', 'media', 'img', 'images', 'content'
                ])
                if is_cdn or 'b-cdn.net' in domain.lower():
                    return True
                
                # Check for common CDN domain patterns
                common_cdn_patterns = ['-cdn', '.cdn', 'cdn.', '.b-cdn.', '.cloudfront.']
                if any(pattern in domain.lower() for pattern in common_cdn_patterns):
                    return True
            
            # Check explicitly listed related domains
            for related in self.related_domains + list(self.detected_domains):
                if domain == related or domain.endswith('.' + related):
                    return True
                
                # Also check if the domain matches without subdomains
                if '.' in related and '.' in domain:
                    domain_base = '.'.join(domain.split('.')[-2:])
                    related_base = '.'.join(related.split('.')[-2:])
                    if domain_base == related_base:
                        return True

            return False
        except Exception as e:
            logger.error(f"Error checking domain for {url}: {e}")
            return False

    def normalize_url(self, url: str, base_url: str) -> str:
        """
        Normalize URLs by handling relative paths and removing Wayback prefixes.

        Args:
            url: URL to normalize
            base_url: Base URL for resolving relative links

        Returns:
            Normalized URL or empty string for non-HTTP URLs
        """
        if not url:
            return ''

        # Skip non-web URLs but keep mailto: and tel: links
        if url.startswith(('data:', 'javascript:', '#')):
            return ''
            
        # Skip Cloudflare email protection and CDN injected scripts
        if 'cdn-cgi/l/email-protection' in url or 'cdn-cgi/scripts' in url or 'cloudflare-static/email-decode' in url:
            return '#'
            
        # Explicitly skip archive.org URLs that aren't for extracting content
        if ('archive.org' in url or 'web.archive.org' in url) and not (
            url.startswith(self.wayback_root) or
            '//web.archive.org/web/' in url or
            url.startswith('/web/')
        ):
            logger.debug(f"Skipping archive.org URL that's not a Wayback snapshot: {url}")
            return ''
            
        # Special handling for mailto: and tel: links
        if url.startswith(('mailto:', 'tel:')):
            return url
            
        # Handle Wayback Machine specific URL formats for resources
        wayback_modifiers_pattern = r'^/web/\d+(?:cs_|js_|im_|if_|fw_|id_)?/'
        if re.match(wayback_modifiers_pattern, url):
            logger.debug(f"Found resource with Wayback modifier: {url}")
            parts = url.split('/', 4)
            if len(parts) >= 5:
                original_path = '/' + parts[4]
                parsed_base = urlparse(base_url)
                domain = parsed_base.netloc
                scheme = parsed_base.scheme if parsed_base.scheme else 'https'
                reconstructed_url = f"{scheme}://{domain}{original_path}"
                logger.debug(f"Reconstructed URL from Wayback resource: {reconstructed_url}")
                return reconstructed_url
        
        # Handle relative Wayback URLs (starting with /web/)
        if url.startswith('/web/'):
            logger.debug(f"Found relative Wayback URL: {url}")
            original_url, _ = self.extract_original_url(url)
            if original_url:
                url = original_url
                logger.debug(f"Extracted from relative Wayback URL: {url}")
            else:
                logger.debug(f"Failed to extract original URL from Wayback URL: {url}")
                return ''
            
        # Handle Wayback Machine mailto: links
        if 'web.archive.org/web/' in url and 'mailto:' in url:
            mail_match = re.search(r'(?:https?:)?//[^/]+/mailto:(.*)', url)
            if mail_match:
                return 'mailto:' + mail_match.group(1)

        # Handle full Wayback URLs
        if url.startswith(self.wayback_root) or '//web.archive.org/web/' in url:
            original_url, _ = self.extract_original_url(url)
            if original_url:
                url = original_url
            else:
                logger.debug(f"Failed to extract original URL from full Wayback URL: {url}")
                return ''

        # Skip archive.org URLs that somehow got through the previous filters
        if 'archive.org' in url or 'web.archive.org' in url:
            logger.debug(f"Skipping archive.org URL that passed through filters: {url}")
            return ''

        # Fix protocol-relative URLs (starting with //)
        if url.startswith('//'):
            url = 'https:' + url

        # Handle double protocol issues
        url = self._fix_protocol_issues(url)

        # Handle URLs without protocol
        if not url.startswith(('http://', 'https://', '/')) and '.' in url and '/' in url:
            domain_part = url.split('/', 1)[0]
            if '.' in domain_part and not ' ' in domain_part:
                url = 'https://' + url
        
        # Handle relative URLs after fixing protocol issues
        if not url.startswith(('http://', 'https://')):
            url = urljoin(base_url, url)

        # Handle domain repeated in path
        domain_match = re.match(r'(https?://[^/]+)/+\1', url)
        if domain_match:
            url = domain_match.group(1) + url[len(domain_match.group(0)):]
            
        # Check for domains embedded in the path
        if self._has_embedded_domain(url):
            return ''

        # Final check for archive.org domains
        try:
            parsed = urlparse(url)
            if 'archive.org' in parsed.netloc or 'web.archive.org' in parsed.netloc:
                logger.debug(f"Skipping archive.org URL found after parsing: {url}")
                return ''
        except Exception:
            pass

        # Clean up any unintended double slashes in the path
        url_parts = url.split('://', 1)
        if len(url_parts) > 1:
            protocol = url_parts[0] + '://'
            path = url_parts[1].replace('//', '/')
            url = protocol + path

        return url

    def is_equivalent_url(self, url1: str, url2: str) -> bool:
        """
        Check if two URLs are semantically equivalent.
        Handles cases like '/page' and '/page.html' pointing to the same resource.

        Args:
            url1: First URL to compare
            url2: Second URL to compare

        Returns:
            True if the URLs are semantically equivalent
        """
        if url1 == url2:
            return True
            
        try:
            parsed1 = urlparse(url1)
            parsed2 = urlparse(url2)
            
            if parsed1.netloc != parsed2.netloc:
                return False
                
            path1 = parsed1.path.rstrip('/')
            path2 = parsed2.path.rstrip('/')
            
            if path1 == path2:
                return True
            elif path1 + '.html' == path2 or path1 + '.htm' == path2:
                return True
            elif path2 + '.html' == path1 or path2 + '.htm' == path1:
                return True
                
            import os
            path1_dir = os.path.dirname(path1)
            path2_dir = os.path.dirname(path2)
            
            if path1_dir == path2 and os.path.basename(path1) in ('index.html', 'index.htm'):
                return True
            if path2_dir == path1 and os.path.basename(path2) in ('index.html', 'index.htm'):
                return True
                
            return False
        except Exception:
            return False

    def get_wayback_url(self, url: str, timestamp: str = None, content_type: str = None) -> str:
        """
        Convert a normal URL to a Wayback Machine URL.

        Args:
            url: Original URL
            timestamp: Wayback timestamp (defaults to self.timestamp)
            content_type: Content type for determining the appropriate modifier

        Returns:
            Wayback Machine URL
        """
        timestamp = timestamp or self.timestamp

        # Make sure URL doesn't already have a Wayback prefix
        if url.startswith(self.wayback_root):
            return url

        # Normalize URL if needed
        if not url.startswith(('http://', 'https://')):
            if url.startswith('//'):
                url = 'https:' + url
            else:
                url = 'https://' + url

        # Determine the appropriate modifier based on content type or file extension
        modifier = ''

        if content_type:
            from .config import CONTENT_TYPE_MODIFIERS
            for type_prefix, mod in CONTENT_TYPE_MODIFIERS.items():
                if content_type.startswith(type_prefix):
                    modifier = mod
                    break
                    
            if content_type == 'application/javascript' and 'module' in content_type:
                modifier = 'jm_'
            else:
                parsed = urlparse(url)
                path = parsed.path.lower()
                if path.endswith(('.css')):
                    modifier = 'cs_'
                elif path.endswith(('.js')):
                    if '.module.js' in path or '.esm.js' in path:
                        modifier = 'jm_'
                    else:
                        modifier = 'js_'
                elif path.endswith(('.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico')):
                    modifier = 'im_'

        return f"{self.wayback_root}/web/{timestamp}{modifier}/{url}"