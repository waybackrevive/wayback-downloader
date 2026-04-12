"""
Content processing for HTML, CSS, and JavaScript files.
"""
import re
import os
import logging
from typing import List, Tuple, Union, Any
from bs4 import BeautifulSoup
from .config import REMOVAL_PATTERNS, META_URL_PROPERTIES

logger = logging.getLogger(__name__)

class ContentProcessor:
    """Processes and cleans content from Wayback Machine."""
    def __init__(self, url_utils, file_manager, headless_render: bool = False):
        """
        Initialize the content processor.

        Args:
            url_utils: URLUtils instance for URL manipulation
            file_manager: FileManager instance for path management
            headless_render: Whether headless rendering is enabled
        """
        self.url_utils = url_utils
        self.file_manager = file_manager
        self.headless_render = headless_render
        self.removal_patterns = REMOVAL_PATTERNS

    def clean_content(self, content: Union[bytes, str], is_html: bool = False) -> Union[bytes, str]:
        """
        Remove Wayback Machine artifacts from content.

        Args:
            content: Content to clean
            is_html: Whether the content is HTML

        Returns:
            Cleaned content
        """
        if self.headless_render and is_html:
            return self._clean_html_headless_mode(content)

        if isinstance(content, str):
            content_bytes = content.encode('utf-8')
            was_string = True
        else:
            content_bytes = content
            was_string = False

        content_type = self._detect_content_type(content, is_html, was_string)

        # Apply removal patterns
        for pattern in self.removal_patterns:
            try:
                if isinstance(pattern, bytes):
                    content_bytes = re.sub(pattern, b'', content_bytes)
                else:
                    content_bytes = re.sub(pattern.pattern.encode('utf-8'), b'', content_bytes)
            except Exception as e:
                logger.error(f"Error applying pattern {pattern}: {e}")

        # Apply format-specific cleanups
        if content_type == "js" and len(content_bytes) > 0:
            content_bytes = self._clean_js_content(content_bytes)
        elif content_type == "css" and len(content_bytes) > 0:
            content_bytes = self._clean_css_content(content_bytes)
        elif content_type == "html" and len(content_bytes) > 0 and not self.headless_render:
            content_bytes = self._clean_html_content(content_bytes)

        if was_string:
            return content_bytes.decode('utf-8', errors='replace')
        return content_bytes

    def _detect_content_type(self, content: Union[bytes, str], is_html: bool, was_string: bool) -> str:
        """Detect the content type from a sample."""
        if is_html:
            return "html"

        if was_string or (isinstance(content, bytes) and len(content) > 0):
            try:
                sample = content if isinstance(content, str) else content.decode('utf-8', errors='replace')
                if re.search(r'(@import|@media|@font-face|\{|\}|url\()', sample):
                    return "css"
                elif re.search(r'(function|var |let |const |if\s*\(|for\s*\(|return |window\.|document\.)', sample):
                    return "js"
            except Exception:
                pass
        return "generic"

    def _clean_html_headless_mode(self, content: Union[bytes, str]) -> Union[bytes, str]:
        """Clean HTML content in headless mode (preserve scripts)."""
        try:
            if isinstance(content, str):
                html_content = content
            else:
                html_content = content.decode('utf-8', errors='replace')

            soup = BeautifulSoup(html_content, 'lxml')

            for element_id in ['wm-ipp-base', 'wm-ipp', 'donato', 'wm-ipp-print']:
                element = soup.find(id=element_id)
                if element:
                    element.decompose()

            if isinstance(content, str):
                return str(soup)
            else:
                return str(soup).encode('utf-8')

        except Exception as e:
            logger.error(f"Error in minimal cleaning of HTML for headless mode: {e}")
            return content

    def _clean_js_content(self, content_bytes: bytes) -> bytes:
        """Clean JavaScript content."""
        try:
            js_content = content_bytes.decode('utf-8', errors='replace')
            
            # Remove the complete wombat wrapper structure
            js_content = self._remove_wombat_wrapper(js_content)
            
            # Remove footer comments
            js_content = re.sub(r'/\*\s*FILE ARCHIVED ON[\s\S]*?\*/', '', js_content, flags=re.DOTALL)
            js_content = re.sub(r'/\*\s*playback timings[\s\S]*?\*/', '', js_content, flags=re.DOTALL)
            
            return js_content.encode('utf-8')
        except Exception as e:
            logger.error(f"Error cleaning JavaScript content: {e}")
            return content_bytes

    def _clean_css_content(self, content_bytes: bytes) -> bytes:
        """Clean CSS content."""
        try:
            css_content = content_bytes.decode('utf-8', errors='replace')
            css_content = re.sub(r'/\*\s*FILE ARCHIVED ON[\s\S]*?SECTION 108\(a\)\(3\)\).\s*\*/', '', css_content, re.DOTALL)
            css_content = re.sub(r'/\*\s*playback timings[\s\S]*?\*/', '', css_content, re.DOTALL)
            css_content = re.sub(r'/\*\s*FILE ARCHIVED ON.*?\*/', '', css_content, re.DOTALL)
            css_content = re.sub(r'/\*\s*WAYBACK MACHINE.*?\*/', '', css_content, re.DOTALL)
            css_content = re.sub(r'/\*[\s\S]*?FILE ARCHIVED[\s\S]*?\*/\s*$', '', css_content, re.DOTALL)
            return css_content.encode('utf-8')
        except Exception as e:
            logger.error(f"Error cleaning CSS content: {e}")
            return content_bytes

    def _remove_wombat_wrapper(self, js_content: str) -> str:
        """
        Remove the complete wombat wrapper structure from JavaScript.
        
        The structure is:
        var _____WB$wombat$assign$function_____=function(...){...};
        if(!self.__WB_pmw){self.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}
        {
          let window = _____WB$wombat$assign$function_____("window");
          let self = _____WB$wombat$assign$function_____("self");
          let document = _____WB$wombat$assign$function_____("document");
          let location = _____WB$wombat$assign$function_____("location");
          let top = _____WB$wombat$assign$function_____("top");
          let parent = _____WB$wombat$assign$function_____("parent");
          let frames = _____WB$wombat$assign$function_____("frames");
          let opens = _____WB$wombat$assign$function_____("opens");
          [ACTUAL CODE]
        }
        /* FILE ARCHIVED ON ... */
        /* playback timings ... */
        """
        # Pattern to match the complete wombat wrapper including opening brace and let statements
        wombat_pattern = re.compile(
            r'var\s+_____WB\$wombat\$assign\$function_____\s*=\s*function\([^)]*\)\s*\{[^}]*\}\s*;'
            r'\s*if\s*\(\s*!\s*self\.__WB_pmw\s*\)\s*\{[^}]*\}\s*'
            r'\{\s*'  # Opening brace
            r'let\s+window\s*=[^;]+;\s*'
            r'let\s+self\s*=[^;]+;\s*'
            r'let\s+document\s*=[^;]+;\s*'
            r'let\s+location\s*=[^;]+;\s*'
            r'let\s+top\s*=[^;]+;\s*'
            r'let\s+parent\s*=[^;]+;\s*'
            r'let\s+frames\s*=[^;]+;\s*'
            r'let\s+opens\s*=[^;]+;\s*'
            r'([\s\S]*?)'  # Capture the actual code
            r'\s*\}\s*'  # Closing brace
            r'(?:/\*\s*FILE ARCHIVED ON[\s\S]*?\*/\s*)?'  # Optional footer comment
            r'(?:/\*\s*playback timings[\s\S]*?\*/\s*)?'  # Optional playback timings
            r'$',
            re.DOTALL
        )
        
        match = wombat_pattern.search(js_content)
        if match:
            # Extract the actual code (group 1)
            extracted_code = match.group(1).strip()
            logger.info("Successfully extracted code from wombat wrapper")
            return extracted_code
        
        # Fallback: try a simpler pattern if the complex one doesn't match
        # This handles cases where the structure might be slightly different
        simple_pattern = re.compile(
            r'var\s+_____WB\$wombat\$assign\$function_____[\s\S]*?'
            r'let\s+opens\s*=[^;]+;\s*'
            r'([\s\S]*?)'
            r'\s*\}\s*'
            r'(?:/\*\s*FILE ARCHIVED ON[\s\S]*?\*/\s*)?'
            r'(?:/\*\s*playback timings[\s\S]*?\*/\s*)?'
            r'$',
            re.DOTALL
        )
        
        simple_match = simple_pattern.search(js_content)
        if simple_match:
            extracted_code = simple_match.group(1).strip()
            logger.info("Successfully extracted code from wombat wrapper using simple pattern")
            return extracted_code
        
        logger.debug("No wombat wrapper found in JavaScript content")
        return js_content

    def _clean_html_content(self, content_bytes: bytes) -> bytes:
        """Clean HTML content in non-headless mode."""
        try:
            soup = BeautifulSoup(content_bytes.decode('utf-8', errors='replace'), 'lxml')

            # Remove Wayback Machine elements
            for element_id in ['wm-ipp-base', 'wm-ipp', 'donato', 'wm-ipp-print', 'playback']:
                element = soup.find(id=element_id)
                if element:
                    element.decompose()

            # Remove Wayback Machine scripts
            for script in soup.find_all('script'):
                src = script.get('src', '')
                if src and ('/_static/' in src or 'web-static.archive.org' in src):
                    script.decompose()
                elif script.string and any(x in (script.string or '') for x in [
                    '__wm', 'wombat', 'archive_analytics', 'RufflePlayer', 'wayback_machine'
                ]):
                    script.decompose()

            # Remove specific link elements
            for link in soup.find_all('link'):
                href = link.get('href', '')
                if 'archive.org' in href or 'web.archive.org' in href:
                    link.decompose()

            # Remove Cloudflare email protection
            for script in soup.find_all('script', attrs={'data-cfasync': True}):
                script.extract()

            for script in soup.find_all('script', src=re.compile(r'cdn-cgi/scripts|cloudflare-static/email-decode')):
                script.extract()

            # Clean head tag
            head_tag = soup.find('head')
            if head_tag:
                wayback_end_marker = '<!-- End Wayback Rewrite JS Include -->'
                head_html = str(head_tag)
                if wayback_end_marker in head_html:
                    end_marker_pos = head_html.find(wayback_end_marker) + len(wayback_end_marker)
                    head_start = head_html[:head_html.find('>') + 1]
                    head_end = head_html[end_marker_pos:]
                    new_head_html = head_start + head_end
                    new_head = BeautifulSoup(new_head_html, 'lxml').head
                    head_tag.replace_with(new_head)

            return str(soup).encode('utf-8')
        except Exception as e:
            logger.error(f"Error cleaning HTML with BeautifulSoup: {e}")
            return content_bytes

    def process_html(self, content: bytes, url: str, visited_urls: set = None) -> Tuple[bytes, List[str]]:
        """
        Process HTML content to fix links and extract new URLs.

        Args:
            content: HTML content
            url: URL of the HTML document
            visited_urls: Set of already visited URLs

        Returns:
            Tuple of (processed_content, new_urls_to_crawl)
        """
        cleaned_content = self.clean_content(content, is_html=True)
        new_urls = []
        visited_urls = visited_urls or set()

        try:
            soup = BeautifulSoup(cleaned_content.decode('utf-8', errors='replace'), 'lxml')

            # Remove Wayback elements
            for element_id in ['wm-ipp-base', 'wm-ipp', 'donato', 'wm-ipp-print', 'playback']:
                element = soup.find(id=element_id)
                if element:
                    element.decompose()

            # Get base URL
            base_tag = soup.find('base', href=True)
            if base_tag and 'href' in base_tag.attrs:
                base_url = base_tag['href']
                if base_url.startswith(self.url_utils.wayback_root):
                    orig_base_url, _ = self.url_utils.extract_original_url(base_url)
                    if orig_base_url:
                        base_tag['href'] = orig_base_url
                        base_url = orig_base_url
            else:
                base_url = url

            # Process canonical links
            self._process_canonical_links(soup)

            # Process meta tags
            self._process_meta_tags(soup)

            # Process inline scripts
            self._process_inline_scripts(soup)

            # Process script tags
            self._process_script_tags(soup, base_url, url, new_urls)

            # Process Wix links
            self._process_wix_links(soup, base_url, url, new_urls)

            # Process standard elements
            self._process_standard_elements(soup, base_url, url, new_urls)

            # Process inline styles
            for tag in soup.find_all(style=True):
                if tag['style']:
                    css_content, css_urls = self.process_css(tag['style'], base_url, url)
                    new_urls.extend(css_urls)
                    tag['style'] = css_content

            # Process style tags
            for style in soup.find_all('style'):
                if style.string:
                    css_content, css_urls = self.process_css(style.string, base_url, url)
                    new_urls.extend(css_urls)
                    style.string = css_content

            # Process srcset
            self._process_srcset(soup, base_url, url, new_urls)

            # Process background-image styles
            self._process_background_styles(soup, base_url, url, new_urls)

            # Process custom data attributes
            self._process_data_attributes(soup, base_url, url, new_urls)

            # Process JSON-LD
            self._process_json_ld(soup, base_url, url, new_urls)

            return str(soup).encode('utf-8'), new_urls

        except Exception as e:
            logger.error(f"Error processing HTML: {e}")
            return cleaned_content, []

    def _process_canonical_links(self, soup: BeautifulSoup) -> None:
        """Process canonical link tags."""
        for link in soup.find_all('link', rel='canonical'):
            if 'href' in link.attrs:
                href_value = link['href']
                if href_value.startswith(self.url_utils.wayback_root) or '//web.archive.org/web/' in href_value or href_value.startswith('/web/'):
                    original_url, _ = self.url_utils.extract_original_url(href_value)
                    if original_url:
                        link['href'] = original_url

    def _process_meta_tags(self, soup: BeautifulSoup) -> None:
        """Process meta tags with URLs."""
        for meta in soup.find_all('meta'):
            if 'content' not in meta.attrs:
                continue

            is_url_meta = False

            if 'property' in meta.attrs:
                property_value = meta['property'].lower()
                is_url_meta = any(url_prop in property_value for url_prop in META_URL_PROPERTIES)
            elif 'name' in meta.attrs:
                name_value = meta['name'].lower()
                is_url_meta = any(url_prop in name_value for url_prop in META_URL_PROPERTIES)
                is_url_meta = is_url_meta or name_value in ['twitter:image', 'thumbnail', 'image']
            elif 'itemprop' in meta.attrs:
                itemprop_value = meta['itemprop'].lower()
                is_url_meta = itemprop_value in ['image', 'url', 'logo', 'thumbnailUrl']

            if is_url_meta:
                content_value = meta['content']
                if content_value.startswith(self.url_utils.wayback_root) or '//web.archive.org/web/' in content_value or content_value.startswith('/web/'):
                    original_url, _ = self.url_utils.extract_original_url(content_value)
                    if original_url:
                        meta['content'] = original_url

    def _process_inline_scripts(self, soup: BeautifulSoup) -> None:
        """Process inline script contents."""
        for script in soup.find_all('script'):
            if not script.has_attr('src') and script.string:
                script_content = script.string

                if 'web.archive.org/web/' in script_content:
                    wayback_pattern = r'([\'"]|//)(https?://web\.archive\.org/web/\d+(?:[a-z]{2}_)?/(?:https?:)?//[^\s\'"<>]+?)([\'"])'

                    def replace_script_url(match):
                        quote_start = match.group(1)
                        url = match.group(2)
                        quote_end = match.group(3)

                        original_url, _ = self.url_utils.extract_original_url(url)
                        if original_url:
                            return f"{quote_start}{original_url}{quote_end}"
                        return match.group(0)

                    modified_content = re.sub(wayback_pattern, replace_script_url, script_content)

                    rel_wayback_pattern = r'([\'"])//web\.archive\.org/web/\d+(?:[a-z]{2}_)?/(?:https?:)?//([^\s\'"<>]+?)([\'"])'
                    modified_content = re.sub(rel_wayback_pattern,
                                            lambda m: f"{m.group(1)}https://{m.group(2)}{m.group(3)}",
                                            modified_content)

                    script.string = modified_content

    def _process_script_tags(self, soup: BeautifulSoup, base_url: str, url: str, new_urls: List[str]) -> None:
        """Process script tags with src attributes."""
        for script in soup.find_all('script'):
            if not script.has_attr('src'):
                continue

            src_value = script['src']

            if src_value.startswith(('javascript:', 'data:')):
                continue

            if ('cdn-cgi' in src_value or 'cloudflare-static' in src_value or
                'email-decode' in src_value or 'data-cfasync' in str(script)):
                script.extract()
                continue

            # Handle Wayback URLs
            if src_value.startswith('/web/'):
                original_url, _ = self.url_utils.extract_original_url(src_value)
                if original_url:
                    src_value = original_url
            elif src_value.startswith(self.url_utils.wayback_root) or '//web.archive.org/web/' in src_value:
                original_url, _ = self.url_utils.extract_original_url(src_value)
                if original_url:
                    src_value = original_url

            normalized_url = self.url_utils.normalize_url(src_value, base_url)

            if normalized_url:
                should_download = self.url_utils.is_same_domain_or_related(normalized_url)

                if should_download:
                    new_urls.append(normalized_url)
                    local_path, _ = self.file_manager.get_local_path(normalized_url, register=False)
                    current_path, _ = self.file_manager.get_local_path(url, register=False)

                    rel_path = os.path.relpath(
                        local_path,
                        os.path.dirname(current_path)
                    ).replace('\\', '/')

                    script['src'] = rel_path
                else:
                    script['src'] = normalized_url

    def _process_wix_links(self, soup: BeautifulSoup, base_url: str, url: str, new_urls: List[str]) -> None:
        """Process Wix-specific link elements."""
        wix_links = []
        for link_element in soup.find_all(attrs={"data-testid": "linkElement"}):
            if link_element.has_attr('href'):
                wix_links.append(link_element)

        for link_element in wix_links:
            attr_value = link_element['href']

            if attr_value.startswith(('#', 'javascript:', 'data:')):
                continue

            if attr_value.startswith(self.url_utils.wayback_root) or '//web.archive.org/web/' in attr_value:
                original_url, _ = self.url_utils.extract_original_url(attr_value)
                if original_url:
                    attr_value = original_url

            normalized_url = self.url_utils.normalize_url(attr_value, base_url)

            if normalized_url and self.url_utils.is_same_domain_or_related(normalized_url):
                new_urls.append(normalized_url)
                local_path, _ = self.file_manager.get_local_path(normalized_url, register=False)
                current_path, _ = self.file_manager.get_local_path(url, register=False)
                rel_path = os.path.relpath(
                    local_path,
                    os.path.dirname(current_path)
                ).replace('\\', '/')
                link_element['href'] = rel_path

    def _process_standard_elements(self, soup: BeautifulSoup, base_url: str, url: str, new_urls: List[str]) -> None:
        """Process standard HTML elements with URLs."""
        for tag, attrs in [
            ('a', 'href'), ('img', 'src'), ('script', 'src'),
            ('link', 'href'), ('source', 'src'), ('iframe', 'src'),
            ('video', 'src'), ('audio', 'src'), ('embed', 'src'),
            ('object', 'data'), ('form', 'action')
        ]:
            for element in soup.find_all(tag, **{attrs: True}):
                # For link elements, only process stylesheets and icons
                if tag == 'link':
                    rel = element.get('rel', [])
                    if isinstance(rel, str):
                        rel = [rel]
                    if not any(r in rel for r in ['stylesheet', 'icon', 'shortcut']):
                        continue

                attr_value = element[attrs]

                if attr_value.startswith(('#', 'javascript:', 'data:')):
                    continue

                if 'cdn-cgi/l/email-protection' in attr_value:
                    element[attrs] = '#'
                    continue

                if attr_value.startswith(('mailto:', 'tel:')) or 'mailto:' in attr_value:
                    if 'web.archive.org/web/' in attr_value and 'mailto:' in attr_value:
                        mail_match = re.search(r'(?:https?:)?//[^/]+/mailto:(.*)', attr_value)
                        if mail_match:
                            element[attrs] = 'mailto:' + mail_match.group(1)
                    continue

                # Handle Wayback URLs
                attr_value = self._extract_from_wayback(attr_value)

                normalized_url = self.url_utils.normalize_url(attr_value, base_url)

                if normalized_url:
                    if 'archive.org' in normalized_url or 'web.archive.org' in normalized_url:
                        element[attrs] = normalized_url
                        continue

                    if self.url_utils.is_external_cdn_resource(normalized_url):
                        element[attrs] = normalized_url
                        continue

                    should_download = self.url_utils.is_same_domain_or_related(normalized_url)

                    if should_download:
                        # Always add to new_urls for crawling
                        if normalized_url not in new_urls:
                            new_urls.append(normalized_url)
                            logger.debug(f"Added URL to crawl queue: {normalized_url} (tag: {tag})")
                        
                        local_path, _ = self.file_manager.get_local_path(normalized_url, register=False)
                        current_path, _ = self.file_manager.get_local_path(url, register=False)
                        rel_path = os.path.relpath(
                            local_path,
                            os.path.dirname(current_path)
                        )
                        element[attrs] = rel_path.replace('\\', '/')
                    else:
                        element[attrs] = normalized_url

    def _extract_from_wayback(self, attr_value: str) -> str:
        """Extract original URL from Wayback URL in attribute."""
        if re.match(r'^/web/\d+(?:cs_|js_|im_|if_|fw_|id_)?/', attr_value):
            wayback_pattern = r'^/web/(\d+)((?:cs_|js_|im_|if_|fw_|id_)?)/(https?://)?(.+)$'
            wayback_match = re.match(wayback_pattern, attr_value)

            if wayback_match:
                protocol = wayback_match.group(3) or 'https://'
                if not protocol.endswith('://'):
                    protocol += '://'
                path = wayback_match.group(4)

                if path.startswith(('http://', 'https://')):
                    attr_value = path
                else:
                    attr_value = protocol + path
            elif attr_value.startswith('/web/'):
                original_url, _ = self.url_utils.extract_original_url(attr_value)
                if original_url:
                    attr_value = original_url
            elif attr_value.startswith(self.url_utils.wayback_root) or '//web.archive.org/web/' in attr_value:
                original_url, _ = self.url_utils.extract_original_url(attr_value)
                if original_url:
                    attr_value = original_url

        return attr_value

    def _process_srcset(self, soup: BeautifulSoup, base_url: str, url: str, new_urls: List[str]) -> None:
        """Process srcset attributes."""
        for element in soup.find_all(['img', 'source'], srcset=True):
            srcset_value = element['srcset']
            new_srcset_parts = []

            srcset_parts = re.findall(r'([^,]+)(?:,|$)', srcset_value)

            for part in srcset_parts:
                url_match = re.match(r'^\s*([^\s]+)(\s+[^,\s]+)?', part.strip())
                if url_match:
                    img_url = url_match.group(1)
                    descriptor = url_match.group(2) or ''

                    if img_url.startswith(self.url_utils.wayback_root) or '//web.archive.org/web/' in img_url:
                        original_url, _ = self.url_utils.extract_original_url(img_url)
                        if original_url:
                            img_url = original_url

                    normalized_url = self.url_utils.normalize_url(img_url, base_url)

                    if normalized_url and self.url_utils.is_same_domain_or_related(normalized_url):
                        new_urls.append(normalized_url)
                        local_path, _ = self.file_manager.get_local_path(normalized_url, register=False)
                        current_path, _ = self.file_manager.get_local_path(url, register=False)
                        rel_path = os.path.relpath(
                            local_path,
                            os.path.dirname(current_path)
                        ).replace('\\', '/')
                        new_srcset_parts.append(f"{rel_path}{descriptor}")
                    else:
                        new_srcset_parts.append(f"{normalized_url}{descriptor}")

            if new_srcset_parts:
                element['srcset'] = ', '.join(new_srcset_parts)

    def _process_background_styles(self, soup: BeautifulSoup, base_url: str, url: str, new_urls: List[str]) -> None:
        """Process background-image in style attributes."""
        for element in soup.find_all(style=True):
            style_content = element['style']
            if 'url(' in style_content:
                url_pattern = r'url\([\'"]?([^\'"\)]+)[\'"]?\)'
                for url_match in re.finditer(url_pattern, style_content):
                    img_url = url_match.group(1)

                    if img_url.startswith('data:'):
                        continue

                    if img_url.startswith(self.url_utils.wayback_root) or '//web.archive.org/web/' in img_url:
                        original_url, _ = self.url_utils.extract_original_url(img_url)
                        if original_url:
                            img_url = original_url

                    normalized_url = self.url_utils.normalize_url(img_url, base_url)

                    if normalized_url and self.url_utils.is_same_domain_or_related(normalized_url):
                        new_urls.append(normalized_url)
                        local_path, _ = self.file_manager.get_local_path(normalized_url, register=False)
                        current_path, _ = self.file_manager.get_local_path(url, register=False)
                        rel_path = os.path.relpath(
                            local_path,
                            os.path.dirname(current_path)
                        ).replace('\\', '/')
                        style_content = style_content.replace(
                            f"url({url_match.group(1)})",
                            f"url({rel_path})"
                        )

                element['style'] = style_content

    def _process_data_attributes(self, soup: BeautifulSoup, base_url: str, url: str, new_urls: List[str]) -> None:
        """Process custom data attributes with URLs."""
        elements_to_process = []
        for element in soup.find_all(True):
            attrs_to_check = list(element.attrs.items())
            for attr, value in attrs_to_check:
                if isinstance(value, str) and (attr.startswith('data-') and ('src' in attr or 'url' in attr or 'link' in attr or 'path' in attr) or attr in ['poster', 'background', 'ping']):
                    if value.startswith(('http://', 'https://', '//', self.url_utils.wayback_root)) or '//web.archive.org/web/' in value:
                        elements_to_process.append((element, attr, value))
        
        # Process collected elements outside the main loop
        for element, attr, value in elements_to_process:
            if value.startswith(self.url_utils.wayback_root) or '//web.archive.org/web/' in value:
                original_url, _ = self.url_utils.extract_original_url(value)
                if original_url:
                    value = original_url

            normalized_url = self.url_utils.normalize_url(value, base_url)

            if normalized_url and self.url_utils.is_same_domain_or_related(normalized_url):
                new_urls.append(normalized_url)
                local_path, _ = self.file_manager.get_local_path(normalized_url, register=False)
                current_path, _ = self.file_manager.get_local_path(url, register=False)
                rel_path = os.path.relpath(
                    local_path,
                    os.path.dirname(current_path)
                ).replace('\\', '/')
                element[attr] = rel_path
            else:
                element[attr] = normalized_url

    def _process_json_ld(self, soup: BeautifulSoup, base_url: str, url: str, new_urls: List[str]) -> None:
        """Process JSON-LD script tags."""
        import json
        for script in soup.find_all('script', type='application/ld+json'):
            if script.string:
                try:
                    json_data = json.loads(script.string)
                    self._process_json_urls(json_data, base_url, url, new_urls)
                    script.string = json.dumps(json_data)
                except Exception as e:
                    logger.warning(f"Error processing JSON-LD: {e}")

    def _process_json_urls(self, json_data: Any, base_url: str, current_url: str, new_urls: List[str]) -> None:
        """Process URLs in JSON data recursively."""
        if isinstance(json_data, dict):
            for key, value in list(json_data.items()):
                if isinstance(value, str) and key.lower() in ['url', 'image', 'logo', 'thumbnail', 'src', 'href']:
                    if value.startswith(self.url_utils.wayback_root) or '//web.archive.org/web/' in value:
                        original_url, _ = self.url_utils.extract_original_url(value)
                        if original_url:
                            value = original_url

                    normalized_url = self.url_utils.normalize_url(value, base_url)

                    if normalized_url and ('archive.org' in normalized_url or 'web.archive.org' in normalized_url):
                        continue

                    if normalized_url and self.url_utils.is_same_domain_or_related(normalized_url):
                        new_urls.append(normalized_url)
                        local_path, _ = self.file_manager.get_local_path(normalized_url, register=False)
                        current_path, _ = self.file_manager.get_local_path(current_url, register=False)
                        rel_path = os.path.relpath(
                            local_path,
                            os.path.dirname(current_path)
                        ).replace('\\', '/')
                        json_data[key] = rel_path

                self._process_json_urls(value, base_url, current_url, new_urls)

        elif isinstance(json_data, list):
            for item in json_data:
                self._process_json_urls(item, base_url, current_url, new_urls)

    def process_css(self, css_content: str, base_url: str, current_url: str) -> Tuple[str, List[str]]:
        """
        Process CSS content to fix URLs and extract new URLs.

        Args:
            css_content: CSS content
            base_url: Base URL for resolving relative links
            current_url: URL of the file containing this CSS

        Returns:
            Tuple of (processed_css, new_urls_to_crawl)
        """
        new_urls = []

        css_content = re.sub(r'/\*\s*FILE ARCHIVED ON.*?\*/', '', css_content)
        css_content = re.sub(r'/\*\s*WAYBACK MACHINE.*?\*/', '', css_content)

        url_pattern = r'url\([\'"]?([^\'"\)]+)[\'"]?\)'

        def replace_url(match):
            url = match.group(1).strip('\'"')

            if url.startswith('data:'):
                return match.group(0)

            if url.startswith(self.url_utils.wayback_root) or '//web.archive.org/web/' in url or url.startswith('/web/'):
                original_url, _ = self.url_utils.extract_original_url(url)
                if original_url:
                    url = original_url

            if not url.startswith(('http://', 'https://', '/', '.', '#')):
                if '.' in url and '/' in url:
                    domain_part = url.split('/', 1)[0]
                    if '.' in domain_part:
                        url = 'https://' + url

            if url.startswith('//'):
                url = 'https:' + url

            domain_pattern = r'^(https?://[^/]+)/+\1/?(.*)$'
            domain_match = re.match(domain_pattern, url)
            if domain_match:
                url = domain_match.group(1)
                if domain_match.group(2):
                    url += '/' + domain_match.group(2)

            normalized_url = self.url_utils.normalize_url(url, base_url)

            if normalized_url and ('archive.org' in normalized_url or 'web.archive.org' in normalized_url):
                return f'url("{normalized_url}")'

            if normalized_url and self.url_utils.is_same_domain_or_related(normalized_url):
                new_urls.append(normalized_url)
                local_path, _ = self.file_manager.get_local_path(normalized_url, register=False)
                current_path, _ = self.file_manager.get_local_path(current_url, register=False)
                rel_path = os.path.relpath(
                    local_path,
                    os.path.dirname(current_path)
                )
                rel_path_fixed = rel_path.replace("\\", "/")
                return f'url("{rel_path_fixed}")'
            elif normalized_url:
                return f'url("{normalized_url}")'

            return match.group(0)

        processed_css = re.sub(url_pattern, replace_url, css_content)

        # Process @import url()
        import_url_pattern = r'@import\s+url\([\'"]?([^\'"\)]+)[\'"]?\)'
        processed_css = re.sub(import_url_pattern,
                              lambda m: self._process_import_url(m, base_url, current_url, new_urls),
                              processed_css)

        # Process @import ""
        import_pattern = r'@import\s+[\'"]([^\'"]+)[\'"]'
        processed_css = re.sub(import_pattern,
                              lambda m: self._process_import_string(m, base_url, current_url, new_urls),
                              processed_css)

        # Remove Wayback CSS rules
        processed_css = re.sub(r'#wm-ipp-base\s*{[^}]*}', '', processed_css)
        processed_css = re.sub(r'#wm-ipp[^{]*{[^}]*}', '', processed_css)
        processed_css = re.sub(r'#donato[^{]*{[^}]*}', '', processed_css)
        processed_css = re.sub(r'#wm-ipp-print[^{]*{[^}]*}', '', processed_css)

        return processed_css, new_urls

    def _process_import_url(self, match, base_url: str, current_url: str, new_urls: List[str]) -> str:
        """Process @import url() statement."""
        import_url = match.group(1).strip('\'"')

        if import_url.startswith(self.url_utils.wayback_root) or '//web.archive.org/web/' in import_url or import_url.startswith('/web/'):
            original_url, _ = self.url_utils.extract_original_url(import_url)
            if original_url:
                import_url = original_url

        domain_pattern = r'^(https?://[^/]+)/+\1/?(.*)$'
        domain_match = re.match(domain_pattern, import_url)
        if domain_match:
            import_url = domain_match.group(1)
            if domain_match.group(2):
                import_url += '/' + domain_match.group(2)

        normalized_url = self.url_utils.normalize_url(import_url, base_url)

        if normalized_url and self.url_utils.is_same_domain_or_related(normalized_url):
            new_urls.append(normalized_url)
            local_path, _ = self.file_manager.get_local_path(normalized_url, register=False)
            current_path, _ = self.file_manager.get_local_path(current_url, register=False)
            rel_path = os.path.relpath(
                local_path,
                os.path.dirname(current_path)
            )
            rel_path_fixed = rel_path.replace("\\", "/")
            return f'@import url("{rel_path_fixed}")'
        elif normalized_url:
            return f'@import url("{normalized_url}")'

        return match.group(0)

    def _process_import_string(self, match, base_url: str, current_url: str, new_urls: List[str]) -> str:
        """Process @import "" statement."""
        import_url = match.group(1)

        if import_url.startswith(self.url_utils.wayback_root) or '//web.archive.org/web/' in import_url or import_url.startswith('/web/'):
            original_url, _ = self.url_utils.extract_original_url(import_url)
            if original_url:
                import_url = original_url

        domain_pattern = r'^(https?://[^/]+)/+\1/?(.*)$'
        domain_match = re.match(domain_pattern, import_url)
        if domain_match:
            import_url = domain_match.group(1)
            if domain_match.group(2):
                import_url += '/' + domain_match.group(2)

        normalized_url = self.url_utils.normalize_url(import_url, base_url)

        if normalized_url and self.url_utils.is_same_domain_or_related(normalized_url):
            new_urls.append(normalized_url)
            local_path, _ = self.file_manager.get_local_path(normalized_url)
            current_path, _ = self.file_manager.get_local_path(current_url)
            rel_path = os.path.relpath(
                local_path,
                os.path.dirname(current_path)
            )
            rel_path_fixed = rel_path.replace("\\", "/")
            return f'@import "{rel_path_fixed}"'
        elif normalized_url:
            return f'@import "{normalized_url}"'

        return match.group(0)

    def process_js(self, js_content: str, base_url: str, current_url: str) -> Tuple[str, List[str]]:
        """
        Process JavaScript content to fix URLs and extract new URLs.

        Args:
            js_content: JavaScript content
            base_url: Base URL for resolving relative links
            current_url: URL of the file containing this JavaScript

        Returns:
            Tuple of (processed_js, new_urls_to_crawl)
        """
        new_urls = []

        # Remove wombat wrapper
        js_content = self._remove_wombat_wrapper(js_content)
        
        # Clean general content
        js_content = self.clean_content(js_content)

        # Remove any remaining Wayback Machine artifacts
        js_content = re.sub(r'\/\*\s*Wayback Machine.*?\*\/', '', js_content, flags=re.DOTALL)
        js_content = re.sub(r'var\s+_____WB\$wombat\$assign\$function_____.*?;', '', js_content, flags=re.DOTALL)
        js_content = re.sub(r'if\s*\(\s*typeof\s*__wm\s*===\s*[\'"]undefined[\'"]\s*\).*?;', '', js_content, flags=re.DOTALL)
        js_content = re.sub(r'window\.__wmbVideoInfo\s*=.*?;', '', js_content, flags=re.DOTALL)
        js_content = re.sub(r'/\*\s*FILE ARCHIVED ON[\s\S]*?\*/', '', js_content, flags=re.DOTALL)
        js_content = re.sub(r'/\*\s*playback timings[\s\S]*?\*/', '', js_content, flags=re.DOTALL)

        # Process URL patterns
        url_patterns = [
            (r'([\'"])(https?://web\.archive\.org/web/\d+(?:[a-z]{2}_)?/(?:https?:)?//[^\s\'"<>]+?)([\'"])', True),
            (r'([\'"])(https?://[^\s\'"<>]+?)([\'"])', False),
            (r'([\'"])(//[^\s\'"<>]+?)([\'"])', False),
            (r'([\'"])(\/[^\s\'"<>]+\.(js|css|jpg|jpeg|png|gif|svg|webp|woff|woff2|ttf|eot|mp4|webm|mp3|wav))([\'"])', False)
        ]

        for pattern, is_wayback in url_patterns:
            def replace_url(match, is_wb=is_wayback):
                quote_start = match.group(1)
                url = match.group(2)
                quote_end = match.group(3) if is_wb else match.group(-1)

                if is_wb or url.startswith(self.url_utils.wayback_root) or '//web.archive.org/web/' in url:
                    extracted_url, _ = self.url_utils.extract_original_url(url)
                    if extracted_url:
                        url = extracted_url

                normalized_url = self.url_utils.normalize_url(url, base_url)

                if normalized_url and self.url_utils.is_same_domain_or_related(normalized_url):
                    new_urls.append(normalized_url)
                    local_path, _ = self.file_manager.get_local_path(normalized_url)
                    current_path, _ = self.file_manager.get_local_path(current_url)
                    rel_path = os.path.relpath(
                        local_path,
                        os.path.dirname(current_path)
                    ).replace('\\', '/')
                    return f"{quote_start}{rel_path}{quote_end}"

                if is_wb:
                    return f"{quote_start}{url}{quote_end}"

                return match.group(0)

            js_content = re.sub(pattern, replace_url, js_content)

        return js_content, new_urls