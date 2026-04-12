"""
Wayback Machine Restoration Module

This module provides functionality to restore websites from the Wayback Machine
by downloading and cleaning archived content for local browsing.
"""

from .restore import WaybackRestore
from .config import DEFAULT_DIRECTORIES, BINARY_EXTENSIONS

__all__ = ['WaybackRestore', 'DEFAULT_DIRECTORIES', 'BINARY_EXTENSIONS']