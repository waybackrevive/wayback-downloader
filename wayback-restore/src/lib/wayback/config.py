"""
Configuration constants for Wayback Machine restoration.
"""

import re
from typing import Dict, List, Set

# Wayback Machine configuration
WAYBACK_ROOT = "https://web.archive.org"

# Wayback URL modifiers (im_ for images, cs_ for stylesheets, etc.)
WAYBACK_MODIFIERS = ['im_', 'cs_', 'js_', 'jm_', 'id_', 'if_', 'fw_']

# Common content types and their appropriate modifiers
CONTENT_TYPE_MODIFIERS: Dict[str, str] = {
    'text/css': 'cs_',
    'text/javascript': 'js_',
    'application/javascript': 'js_',
    'module': 'jm_',  # For JavaScript modules
    'image/': 'im_'
}

# Default directory names for assets
DEFAULT_DIRECTORIES: Dict[str, str] = {
    'css': 'css',
    'js': 'js',
    'img': 'img',
    'font': 'font',
    'video': 'video',
    'audio': 'audio'
}

# Common binary file extensions to avoid text processing
BINARY_EXTENSIONS: Set[str] = {
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.ico', '.svg',
    '.woff', '.woff2', '.ttf', '.eot', '.otf',
    '.mp4', '.webm', '.ogg', '.mp3', '.wav',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.rar'
}

# External CDN domains that should be preserved as external links
EXTERNAL_CDN_DOMAINS: List[str] = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'ajax.googleapis.com',
    'cdnjs.cloudflare.com',
    'maxcdn.bootstrapcdn.com',
    'stackpath.bootstrapcdn.com',
    'code.jquery.com',
    'use.fontawesome.com',
    'use.typekit.net',
    'unpkg.com',
    'cdn.jsdelivr.net'
]

# External CDN URL patterns
EXTERNAL_CDN_PATTERNS: List[str] = ['fonts.', 'ajax.', 'cdn.', 'apis.']

# Meta URL properties that might contain URLs
META_URL_PROPERTIES: List[str] = [
    'og:url', 'og:image', 'og:image:secure_url', 'og:video', 'og:video:secure_url',
    'og:audio', 'og:audio:secure_url', 'twitter:image', 'twitter:player', 'msapplication-TileImage',
    'vk:image', 'image', 'canonical'
]


REMOVAL_PATTERNS = [
    # HTML patterns - more specific to avoid removing all scripts
    re.compile(r'<script[^>]*__wm\..*?</script>', re.DOTALL | re.IGNORECASE),
    re.compile(r'<script[^>]*wbinfo.*?</script>', re.DOTALL | re.IGNORECASE),
    re.compile(r'<script[^>]*archive_analytics.*?</script>', re.DOTALL | re.IGNORECASE),
    re.compile(r'<script[^>]*src="/_static/js/bundle-playback\.js.*?</script>', re.DOTALL | re.IGNORECASE),
    re.compile(r'<script[^>]*src="/_static/js/wombat\.js.*?</script>', re.DOTALL | re.IGNORECASE),
    re.compile(r'<script[^>]*src="/_static/js/ruffle/ruffle\.js.*?</script>', re.DOTALL | re.IGNORECASE),
    re.compile(r'<script[^>]*window\.RufflePlayer.*?</script>', re.DOTALL | re.IGNORECASE),
    re.compile(r'<script[^>]*__wm\.init.*?</script>', re.DOTALL | re.IGNORECASE),
    re.compile(r'<link[^>]*href="/(?:_static|_web)/css/.*?>', re.DOTALL | re.IGNORECASE),
    re.compile(r'<!-- BEGIN WAYBACK TOOLBAR INSERT -->.*?<!-- END WAYBACK TOOLBAR INSERT -->', re.DOTALL | re.IGNORECASE),
    re.compile(r'<div[^>]*id="wm-ipp[^"]*".*?</div>', re.DOTALL | re.IGNORECASE),
    re.compile(r'<div[^>]*id="donato[^"]*".*?</div>', re.DOTALL | re.IGNORECASE),
    re.compile(r'<!--\s*FILE ARCHIVED ON[\s\S]*?-->', re.DOTALL | re.IGNORECASE),
    re.compile(r'<!--\s*playback timings[\s\S]*?-->', re.DOTALL | re.IGNORECASE),
    re.compile(r'<!-- End Wayback Rewrite JS Include -->', re.IGNORECASE),
    re.compile(r'<meta[^>]*name="robots"[^>]*>', re.IGNORECASE),

    # JavaScript patterns
    re.compile(r'__wm\.init\("https://web\.archive\.org/web"\);', re.IGNORECASE),
    re.compile(r'__wm\.wombat\([^)]+\);', re.IGNORECASE),
    re.compile(r'__wm\.rw\([^)]+\);', re.IGNORECASE),
    re.compile(r'window\.RufflePlayer[\s\S]*?;', re.IGNORECASE),
    re.compile(r'var wbinfo[\s\S]*?;', re.IGNORECASE),
    re.compile(r'window\.addEventListener\([\'"]DOMContentLoaded[\'"][\s\S]*?\}\);', re.IGNORECASE),
    re.compile(r'<script\s+src="js/archive_org/includes/.*?\.js"[^>]*>.*?</script>', re.IGNORECASE),
    re.compile(r'<script\s+src="js/bundle-playback.*?\.js"[^>]*>.*?</script>', re.IGNORECASE),
    re.compile(r'<script\s+src="js/wombat.*?\.js"[^>]*>.*?</script>', re.IGNORECASE),
    re.compile(r'<script\s+src="js/ruffle/ruffle\.js"[^>]*>.*?</script>', re.IGNORECASE),

    # URL patterns
    re.compile(r'https?://web\.archive\.org/web/\d+[^/]*/(?:https?:)?//'),
    re.compile(r'https?://web(?:-static)?\.archive\.org/_static/'),
    re.compile(r'https?://archive\.org/includes/'),
    re.compile(r'https?://[^/]+/cdn-cgi/scripts/.*?/cloudflare-static/email-decode\.min\.js'),
    re.compile(r'<script[^>]*src="[^"]*cloudflare-static/email-decode[^"]*"[^>]*>.*?</script>', re.DOTALL),
    re.compile(r'<script[^>]*data-cfasync=["\'](false|true)["\'][^>]*>.*?</script>', re.DOTALL),
    re.compile(r'<a[^>]*href="/web/\d+/https?://[^/]+/cdn-cgi/l/email-protection[^"]*"[^>]*>.*?</a>', re.DOTALL),
    re.compile(r'<a[^>]*href="[^"]*cdn-cgi/l/email-protection[^"]*"[^>]*>.*?</a>', re.DOTALL),

    # CSS and JS file comment patterns
    re.compile(r'/\*\s*FILE ARCHIVED ON[\s\S]*?playback timings[\s\S]*?\*/', re.DOTALL),
    re.compile(r'/\*\s*FILE ARCHIVED ON[\s\S]*?\*/', re.DOTALL),
    re.compile(r'/\*\s*playback timings[\s\S]*?\*/', re.DOTALL),

    # JS Wayback wombat wrapper - comprehensive pattern
    re.compile(
        r'var\s+_____WB\$wombat\$assign\$function_____\s*=\s*function\([^)]*\)\s*\{[^}]*\}\s*;'
        r'\s*if\s*\(\s*!\s*self\.__WB_pmw\s*\)\s*\{[^}]*\}\s*\{'
        r'\s*let\s+window\s*=[^;]+;'
        r'\s*let\s+self\s*=[^;]+;'
        r'\s*let\s+document\s*=[^;]+;'
        r'\s*let\s+location\s*=[^;]+;'
        r'\s*let\s+top\s*=[^;]+;'
        r'\s*let\s+parent\s*=[^;]+;'
        r'\s*let\s+frames\s*=[^;]+;'
        r'\s*let\s+opens\s*=[^;]+;',
        re.DOTALL
    ),
    
    # Simpler fallback patterns
    re.compile(r'var\s+_____WB\$wombat\$assign\$function_____\s*=\s*function\([^)]*\)\s*\{[^}]*\}\s*;', re.DOTALL),
    re.compile(r'if\s*\(\s*!\s*self\.__WB_pmw\s*\)\s*\{[^}]*\}', re.DOTALL),
    re.compile(r'^=\s*_____WB\$wombat\$assign\$function_____\("opener"\);\s*', re.MULTILINE),
    re.compile(r'=\s*_____WB\$wombat\$assign\$function_____\("opener"\);', re.DOTALL)
]


# Extension to folder type mapping
EXTENSION_FOLDER_MAP: Dict[str, str] = {
    '.css': 'css',
    '.scss': 'css',
    '.less': 'css',
    '.js': 'js',
    '.jsx': 'js',
    '.ts': 'js',
    '.json': 'js',
    '.png': 'img',
    '.jpg': 'img',
    '.jpeg': 'img',
    '.gif': 'img',
    '.svg': 'img',
    '.webp': 'img',
    '.ico': 'img',
    '.bmp': 'img',
    '.tiff': 'img',
    '.woff': 'font',
    '.woff2': 'font',
    '.ttf': 'font',
    '.otf': 'font',
    '.eot': 'font',
    '.mp4': 'video',
    '.webm': 'video',
    '.ogg': 'video',
    '.avi': 'video',
    '.mov': 'video',
    '.mp3': 'audio',
    '.wav': 'audio',
}

# Folder patterns for path-based detection
FOLDER_PATTERNS: Dict[str, List[str]] = {
    'font': ['fonts', 'font', 'webfonts'],
    'js': ['js', 'scripts', 'javascript'],
    'css': ['css', 'styles', 'stylesheets'],
    'img': ['img', 'images', 'pics', 'photos', 'icons'],
    'video': ['video', 'videos', 'media'],
    'audio': ['audio', 'sound', 'media']
}