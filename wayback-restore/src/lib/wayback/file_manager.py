"""
File path management and writing utilities for Wayback Machine restoration.
"""
import os
import re
import logging
import mimetypes
from pathlib import Path
from urllib.parse import urlparse
from typing import Dict, Tuple, Set
from .config import (
DEFAULT_DIRECTORIES, BINARY_EXTENSIONS, EXTENSION_FOLDER_MAP,
FOLDER_PATTERNS
)

logger = logging.getLogger(__name__)

class FileManager:
    """Manages file paths and writing operations."""
    def __init__(self, domain: str, output_dir: str, directories: Dict[str, str] = None,
                 related_domains: list = None, detected_domains: Set[str] = None):
        """
        Initialize the file manager.

        Args:
            domain: Main domain being restored
            output_dir: Output directory for restored files
            directories: Custom directory names for assets
            related_domains: List of related domains
            detected_domains: Set of auto-detected domains
        """
        self.domain = domain
        self.output_dir = output_dir
        self.directories = directories or DEFAULT_DIRECTORIES.copy()
        self.related_domains = related_domains or []
        self.detected_domains = detected_domains or set()
        self.binary_extensions = BINARY_EXTENSIONS

        # Tracking mappings
        self.url_to_local_path: Dict[str, str] = {}
        self.local_path_to_url: Dict[str, str] = {}

        # Extract domain name for CDN detection
        domain_parts = self.domain.split('.')
        self.domain_name = domain_parts[0] if len(domain_parts) >= 1 else ""

        # Create necessary directories
        os.makedirs(self.output_dir, exist_ok=True)
        for folder in self.directories.values():
            Path(f"{self.output_dir}/{folder}").mkdir(parents=True, exist_ok=True)

    def get_local_path(self, url: str, register: bool = True) -> Tuple[str, str]:
        """
        Determine the local file path for a given URL.

        Args:
            url: URL to convert to local path
            register: Whether to register the URL-to-path mapping

        Returns:
            Tuple of (file_path, folder_type)
        """
        # Check if we've already processed this URL
        if url in self.url_to_local_path:
            filepath = self.url_to_local_path[url]
            folder = os.path.dirname(filepath).split(os.path.sep)[-1] if os.path.dirname(filepath) else ''
            return filepath, folder

        parsed = urlparse(url)
        domain = parsed.netloc
        path = parsed.path

        # Enhanced domain relation check
        is_related_domain = domain in self.related_domains or domain in self.detected_domains
        is_cdn = any(cdn_indicator in domain.lower() for cdn_indicator in [
            'cdn', 'static', 'assets', 'media', 'img', 'images', 'content'
        ])

        is_domain_match = False
        if self.domain_name and self.domain_name in domain.lower():
            is_domain_match = True

        treat_as_resource = is_related_domain or is_cdn or is_domain_match

        _, file_ext = os.path.splitext(path.lower())

        # Handle empty paths
        if not path or path == '/':
            if domain == self.domain:
                filename = 'index.html'
                subfolder = ''
            else:
                filename = domain.replace('.', '_') + '_index.html'
                subfolder = ''
        elif path.rstrip('/') == path and '.' not in os.path.basename(path) and not treat_as_resource:
            path_basename = os.path.basename(path.rstrip('/'))
            path_dirname = os.path.dirname(path.rstrip('/'))

            if domain == self.domain:
                filename = path_basename + '.html'
                subfolder = path_dirname.lstrip('/')
            else:
                filename = path_basename + '.html'
                subfolder = os.path.join(domain.replace('.', '_'), path_dirname.lstrip('/'))
        else:
            path = path.lstrip('/')

            if path.endswith('/'):
                filename = 'index.html'
                if domain == self.domain:
                    subfolder = path[:-1]
                elif treat_as_resource:
                    subfolder = ''
                else:
                    subfolder = os.path.join(domain.replace('.', '_'), path[:-1])
            else:
                filename = os.path.basename(path)
                if domain == self.domain:
                    subfolder = os.path.dirname(path)
                elif treat_as_resource:
                    subfolder = ''
                else:
                    subfolder = os.path.join(domain.replace('.', '_'), os.path.dirname(path))

                file_ext = os.path.splitext(filename)[1].lower()
                server_script_extensions = ['.aspx', '.php', '.asp', '.jsp', '.cfm', '.cgi', '.pl', '.shtml', '.phtml']

                if (not file_ext and not treat_as_resource) or (file_ext in server_script_extensions):
                    if file_ext in server_script_extensions:
                        filename = os.path.splitext(filename)[0] + '.html'
                    elif not file_ext:
                        filename += '.html'

        # Handle query parameters
        if parsed.query:
            base, ext = os.path.splitext(filename)
            query_part = re.sub(r'[=&?]', '_', parsed.query)
            if len(query_part) > 50:
                query_part = query_part[:50] + '_truncated'
            filename = f"{base}_{query_part}{ext}"

        # Handle fragments
        if parsed.fragment:
            base, ext = os.path.splitext(filename)
            fragment = re.sub(r'[^a-zA-Z0-9]', '_', parsed.fragment)
            if len(fragment) > 30:
                fragment = fragment[:30]
            filename = f"{base}_{fragment}{ext}"

        # Ensure filenames are valid
        filename = re.sub(r'[\\/*?:"<>|]', '_', filename)

        # Determine folder type
        ext = os.path.splitext(filename)[1].lower()
        folder = EXTENSION_FOLDER_MAP.get(ext, '')

        # Apply custom directory names
        if folder and folder in self.directories:
            folder = self.directories[folder]

        # For resources from CDN domains
        if treat_as_resource and not folder:
            if '/css/' in path.lower() or 'style' in path.lower():
                folder = self.directories.get('css', 'css')
            elif '/js/' in path.lower() or 'script' in path.lower():
                folder = self.directories.get('js', 'js')
            elif any(img_path in path.lower() for img_path in ['/img/', '/images/', '/pics/']):
                folder = self.directories.get('img', 'img')
            elif '/font' in path.lower() or '/fonts/' in path.lower():
                folder = self.directories.get('font', 'font')
            elif any(ext in path.lower() for ext in ['.woff', '.woff2', '.ttf', '.otf', '.eot']):
                folder = self.directories.get('font', 'font')
            elif any(font_marker in path.lower() for font_marker in ['fontawesome', 'font-awesome', 'webfont', 'iconfont']):
                folder = self.directories.get('font', 'font')

        # Handle special cases for HTML and other content types
        if not folder:
            mime_type = mimetypes.guess_type(filename)[0]
            if mime_type:
                if 'text/html' in mime_type or ext == '.html' or not ext:
                    folder = ''
                elif 'text/css' in mime_type:
                    folder = self.directories.get('css', 'css')
                elif 'javascript' in mime_type:
                    folder = self.directories.get('js', 'js')
                elif 'image/' in mime_type:
                    folder = self.directories.get('img', 'img')
                elif 'font/' in mime_type or 'application/font' in mime_type:
                    folder = self.directories.get('font', 'font')
                elif 'video/' in mime_type:
                    folder = self.directories.get('video', 'video')
                elif 'audio/' in mime_type:
                    folder = self.directories.get('audio', 'audio')

        # Process path segments to avoid duplicates
        if subfolder and folder:
            path_parts = subfolder.split('/')

            current_folder_type = None
            for folder_type, patterns in FOLDER_PATTERNS.items():
                if any(part.lower() in patterns for part in path_parts):
                    current_folder_type = folder_type
                    break

            if current_folder_type and self.directories.get(current_folder_type, current_folder_type) == folder:
                clean_path_parts = []
                for part in path_parts:
                    if part.lower() not in FOLDER_PATTERNS.get(current_folder_type, []):
                        clean_path_parts.append(part)

                if clean_path_parts:
                    subfolder = '/'.join(clean_path_parts)
                else:
                    subfolder = ''

        # Build the full local path
        if subfolder:
            if subfolder == folder or subfolder.startswith(f"{folder}/"):
                filepath = os.path.join(self.output_dir, subfolder, filename)
            elif folder and any(subfolder.lower() == pattern or subfolder.lower().startswith(pattern + '/')
                           for pattern in [folder, folder + 's']):
                filepath = os.path.join(self.output_dir, folder, filename)
            elif folder == 'img' and any(pattern in subfolder.lower()
                                     for pattern in ['img', 'images', 'pics', 'graphics', 'icons']):
                filepath = os.path.join(self.output_dir, folder, filename)
            elif folder == 'js' and any(pattern in subfolder.lower()
                                    for pattern in ['js', 'javascript', 'scripts']):
                filepath = os.path.join(self.output_dir, folder, filename)
            elif folder == 'css' and any(pattern in subfolder.lower()
                                     for pattern in ['css', 'styles', 'stylesheets']):
                filepath = os.path.join(self.output_dir, folder, filename)
            elif folder == 'font' and any(pattern in subfolder.lower()
                                     for pattern in ['font', 'fonts', 'webfonts']):
                filepath = os.path.join(self.output_dir, folder, filename)
            elif folder == 'video' and any(pattern in subfolder.lower()
                                      for pattern in ['video', 'videos', 'media']):
                filepath = os.path.join(self.output_dir, folder, filename)
            elif folder == 'audio' and any(pattern in subfolder.lower()
                                      for pattern in ['audio', 'sound', 'media']):
                filepath = os.path.join(self.output_dir, folder, filename)
            else:
                filepath = os.path.join(self.output_dir, folder, subfolder, filename)
        else:
            filepath = os.path.join(self.output_dir, folder, filename)

        logger.debug(f"URL: {url} -> Local path: {filepath} (folder: {folder}, subfolder: {subfolder})")

        # Store the mapping only if register is True
        if register:
            self.url_to_local_path[url] = filepath
            self.local_path_to_url[filepath] = url

        return filepath, folder

    def write_file(self, filepath: str, content: bytes) -> None:
        """
        Write content to a file, creating directories as needed.

        Args:
            filepath: Path to write the file to
            content: Content to write
        """
        try:
            os.makedirs(os.path.dirname(filepath), exist_ok=True)

            extension = os.path.splitext(filepath)[1].lower()
            if extension == '.css':
                try:
                    css_content = content.decode('utf-8', errors='replace')
                    css_content = re.sub(r'/\*\s*FILE ARCHIVED ON[\s\S]*?\*/$', '', css_content, re.DOTALL)
                    css_content = re.sub(r'/\*\s*playback timings[\s\S]*?\*/$', '', css_content, re.DOTALL)
                    content = css_content.encode('utf-8')
                    logger.info(f"Applied final CSS cleanup for {filepath}")
                except Exception as e:
                    logger.warning(f"Error in final CSS cleanup for {filepath}: {e}")
            elif extension == '.js':
                try:
                    js_content = content.decode('utf-8', errors='replace')

                    if 'var _____WB$wombat$assign$function_____' in js_content or '_____WB$wombat$assign$function_____' in js_content:
                        logger.info(f"Found remaining wombat wrapper in {filepath}, attempting final cleanup")
                        
                        # Try comprehensive pattern first
                        wombat_pattern = re.compile(
                            r'var\s+_____WB\$wombat\$assign\$function_____\s*=\s*function\([^)]*\)\s*\{[^}]*\}\s*;'
                            r'\s*if\s*\(\s*!\s*self\.__WB_pmw\s*\)\s*\{[^}]*\}\s*\{'
                            r'\s*let\s+window\s*=[^;]+;'
                            r'\s*let\s+self\s*=[^;]+;'
                            r'\s*let\s+document\s*=[^;]+;'
                            r'\s*let\s+location\s*=[^;]+;'
                            r'\s*let\s+top\s*=[^;]+;'
                            r'\s*let\s+parent\s*=[^;]+;'
                            r'\s*let\s+frames\s*=[^;]+;'
                            r'\s*let\s+opens\s*=[^;]+;'
                            r'\s*([\s\S]*?)'
                            r'(?:/\*\s*FILE ARCHIVED ON[\s\S]*?\*/\s*)?'
                            r'(?:/\*\s*playback timings[\s\S]*?\*/\s*)?'
                            r'\s*\}\s*$',
                            re.DOTALL
                        )
                        
                        wombat_match = wombat_pattern.search(js_content)
                        if wombat_match:
                            js_content = wombat_match.group(1).strip()
                            logger.info(f"Successfully unwrapped JS using comprehensive pattern: {filepath}")
                        else:
                            # Fallback to simpler pattern
                            simple_pattern = re.compile(
                                r'var\s+_____WB\$wombat\$assign\$function_____[\s\S]*?'
                                r'let\s+opens\s*=[^;]+;\s*'
                                r'([\s\S]*?)'
                                r'(?:/\*\s*FILE ARCHIVED ON[\s\S]*?\*/\s*)?'
                                r'(?:/\*\s*playback timings[\s\S]*?\*/\s*)?'
                                r'\}\s*$',
                                re.DOTALL
                            )
                            simple_match = simple_pattern.search(js_content)
                            if simple_match:
                                js_content = simple_match.group(1).strip()
                                logger.info(f"Successfully unwrapped JS using simple pattern: {filepath}")

                    # Remove footer comments
                    js_content = re.sub(r'/\*\s*FILE ARCHIVED ON[\s\S]*?\*/', '', js_content, flags=re.DOTALL)
                    js_content = re.sub(r'/\*\s*playback timings[\s\S]*?\*/', '', js_content, flags=re.DOTALL)
                    
                    content = js_content.encode('utf-8')
                    logger.info(f"Applied final JS cleanup for {filepath}")
                except Exception as e:
                    logger.warning(f"Error in final JS cleanup for {filepath}: {e}")

            with open(filepath, 'wb') as f:
                logger.info(f"Writing to {filepath}")
                f.write(content)

        except Exception as e:
            logger.error(f"Error writing file {filepath}: {e}")

    def is_binary_file(self, filepath: str) -> bool:
        """Check if a file is binary based on its extension."""
        ext = os.path.splitext(filepath)[1].lower()
        return ext in self.binary_extensions