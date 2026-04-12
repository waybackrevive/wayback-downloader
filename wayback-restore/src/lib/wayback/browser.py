"""
Headless browser functionality using Playwright for Wayback Machine restoration.
"""
import os
import logging
import urllib.parse

logger = logging.getLogger(__name__)

class HeadlessBrowser:
    """Manages headless browser for rendering pages."""
    def __init__(self, output_dir: str):
        """
        Initialize the headless browser manager.

        Args:
            output_dir: Output directory for screenshots
        """
        self.output_dir = output_dir
        self.playwright = None
        self.browser = None
        self.browser_context = None
        self.browser_page = None
        self._initialized = False

    def initialize(self) -> bool:
        """
        Initialize the headless browser using Playwright.

        Returns:
            True if initialization was successful
        """
        try:
            from playwright.sync_api import sync_playwright

            logger.info("Initializing Playwright headless browser")
            self.playwright = sync_playwright().start()
            self.browser = self.playwright.chromium.launch(headless=True)
            self.browser_context = self.browser.new_context(
                viewport={"width": 1920, "height": 1080},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            )
            self.browser_page = self.browser_context.new_page()
            self._initialized = True
            logger.info("Playwright headless browser initialized successfully")
            return True

        except Exception as e:
            logger.error(f"Failed to initialize headless browser: {e}")
            return False

    def close(self) -> None:
        """Close the headless browser and clean up resources."""
        try:
            if self.browser_page:
                self.browser_page.close()
            if self.browser_context:
                self.browser_context.close()
            if self.browser:
                self.browser.close()
            if self.playwright:
                self.playwright.stop()

            self._initialized = False
            logger.info("Headless browser closed successfully")
        except Exception as e:
            logger.error(f"Error closing headless browser: {e}")

    @property
    def is_initialized(self) -> bool:
        """Check if the browser is initialized."""
        return self._initialized

    def render_page(self, url: str) -> str:
        """
        Render a page using the headless browser and return the rendered HTML.

        Args:
            url: URL to render

        Returns:
            Rendered HTML content as string or empty string if failed
        """
        if not self._initialized:
            logger.error("Browser not initialized")
            return ""

        try:
            self.browser_page.set_default_timeout(120000)

            try:
                self.browser_page.goto(url, wait_until="load")

                # Check if page is not archived
                not_archived = self.browser_page.evaluate("""() => {
                    const notArchivedText = "The Wayback Machine has not archived that URL";
                    const bodyText = document.body.textContent || '';
                    const hasNotArchivedMessage = bodyText.includes(notArchivedText);
                    const hasHrmHeading = document.querySelector('h2') &&
                                          document.querySelector('h2').textContent.trim() === 'Hrm.';
                    const errors = [
                        "Page cannot be displayed due to robots.txt",
                        "This URL has been excluded from the Wayback Machine",
                        "not in the Wayback Machine"
                    ];
                    const hasErrorMessage = errors.some(msg => bodyText.includes(msg));
                    return hasNotArchivedMessage || hasHrmHeading || hasErrorMessage;
                }""")

                if not_archived:
                    logger.warning(f"URL was not archived in the Wayback Machine: {url}")
                    return ""

                logger.info("Page exists, waiting for network idle...")
                self.browser_page.wait_for_load_state("networkidle", timeout=60000)
            except Exception as nav_error:
                if "Timeout 120000ms exceeded" in str(nav_error):
                    logger.warning(f"Navigation timeout, checking for partial content: {nav_error}")

                    has_content = self.browser_page.evaluate("""() => {
                        return {
                            title: document.title,
                            bodyLength: document.body ? document.body.innerHTML.length : 0,
                            hasMainContent: document.querySelector('main, #content, .content, article, .article') !== null,
                            hasNotArchivedMessage: (document.body && document.body.textContent || '').includes(
                                "The Wayback Machine has not archived that URL")
                        };
                    }""")

                    if has_content.get('hasNotArchivedMessage', False):
                        logger.warning(f"URL was not archived in the Wayback Machine: {url}")
                        return ""

                    if has_content.get('bodyLength', 0) < 500:
                        logger.warning(f"Page has very little content after timeout: {url}")
                        return ""

                    logger.info(f"Page has content despite timeout. Title: {has_content.get('title', 'No Title')}")
                else:
                    raise nav_error

            # Wait for scripts to execute
            logger.info("Waiting for Wayback Machine scripts to complete rendering...")
            self.browser_page.wait_for_timeout(10000)

            # Scroll through page for lazy content
            self.browser_page.evaluate("""() => {
                function autoScroll() {
                    window.scrollBy(0, 100);
                    if(window.scrollY + window.innerHeight < document.body.scrollHeight) {
                        setTimeout(autoScroll, 100);
                    }
                }
                autoScroll();
            }""")

            self.browser_page.wait_for_timeout(3000)

            # Check for frameworks
            self.browser_page.evaluate("""() => {
                const detectedFrameworks = [];
                if (window.jQuery) detectedFrameworks.push('jQuery');
                if (window.React) detectedFrameworks.push('React');
                if (window.angular) detectedFrameworks.push('Angular');
                if (window.Vue) detectedFrameworks.push('Vue');
                if (window.Wix) detectedFrameworks.push('Wix');
                return detectedFrameworks;
            }""")

            self.browser_page.wait_for_timeout(2000)

            # Check wombat completion
            has_completed = self.browser_page.evaluate("""() => {
                let wombatCompleted = false;
                if (window.__wm && window.__wm.wombat) {
                    const images = document.querySelectorAll('img');
                    const links = document.querySelectorAll('a');
                    let rewrittenElements = 0;
                    
                    for (let i = 0; i < Math.min(images.length, 5); i++) {
                        if (images[i].src && !images[i].src.includes('web.archive.org')) {
                            rewrittenElements++;
                        }
                    }
                    
                    for (let i = 0; i < Math.min(links.length, 5); i++) {
                        if (links[i].href && !links[i].href.includes('web.archive.org')) {
                            rewrittenElements++;
                        }
                    }
                    
                    wombatCompleted = rewrittenElements > 0;
                }
                return wombatCompleted;
            }""")

            if not has_completed:
                logger.info("Wombat scripts haven't finished, waiting additional time...")
                self.browser_page.wait_for_timeout(8000)

            # Take screenshots
            screenshots_dir = os.path.join(self.output_dir, "screenshots")
            os.makedirs(screenshots_dir, exist_ok=True)

            before_cleanup_screenshot = os.path.join(
                screenshots_dir,
                f"{urllib.parse.quote_plus(url)}_before_cleanup.png"
            )
            self.browser_page.screenshot(path=before_cleanup_screenshot)

            # Clean up Wayback elements
            self._cleanup_wayback_elements()

            self.browser_page.wait_for_timeout(1000)

            after_cleanup_screenshot = os.path.join(
                screenshots_dir,
                f"{urllib.parse.quote_plus(url)}_after_cleanup.png"
            )
            self.browser_page.screenshot(path=after_cleanup_screenshot)

            rendered_html = self.browser_page.content()

            logger.info(f"Successfully rendered page: {url}")
            return rendered_html

        except Exception as e:
            logger.error(f"Error rendering page with headless browser: {e}")
            return ""

    def _cleanup_wayback_elements(self) -> None:
        """Remove Wayback Machine UI elements and scripts from the page."""
        self.browser_page.evaluate("""() => {
        console.log("Cleaning up Wayback elements and scripts...");
        ['wm-ipp-base', 'wm-ipp', 'donato', 'wm-ipp-print', 'playback'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.remove();
                    }
                });
                
                const bodyWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT);
                let bodyNode;
                
                while (bodyNode = bodyWalker.nextNode()) {
                    if (bodyNode.nodeValue.includes('BEGIN WAYBACK TOOLBAR INSERT')) {
                        let current = bodyNode.nextSibling;
                        const nodesToRemove = [bodyNode];
                        
                        while (current) {
                            if (current.nodeType === Node.COMMENT_NODE &&
                                current.nodeValue.includes('END WAYBACK TOOLBAR INSERT')) {
                                nodesToRemove.push(current);
                                break;
                            }
                            nodesToRemove.push(current);
                            current = current.nextSibling;
                        }
                        
                        nodesToRemove.forEach(n => {
                            if (n && n.parentNode) {
                                n.parentNode.removeChild(n);
                            }
                        });
                    }
                }
                
                document.querySelectorAll('div, span, a').forEach(el => {
                    if (el.id && (el.id.startsWith('wm-') || el.id.includes('donato'))) {
                        el.remove();
                    }
                });
                
                const headTag = document.head;
                if (headTag) {
                    const headWalker = document.createTreeWalker(
                        headTag,
                        NodeFilter.SHOW_COMMENT,
                        null,
                        false
                    );
                    
                    let commentNode;
                    let endWaybackComment = null;
                    
                    while (commentNode = headWalker.nextNode()) {
                        if (commentNode.nodeValue.includes('End Wayback Rewrite JS Include')) {
                            endWaybackComment = commentNode;
                            break;
                        }
                    }
                    
                    if (endWaybackComment) {
                        const nodesToRemove = [];
                        let currentNode = headTag.firstChild;
                        
                        while (currentNode && currentNode !== endWaybackComment) {
                            if (!(currentNode.nodeType === Node.TEXT_NODE &&
                                 currentNode.textContent.trim() === '')) {
                                nodesToRemove.push(currentNode);
                            }
                            currentNode = currentNode.nextSibling;
                        }
                        
                        if (endWaybackComment) {
                            nodesToRemove.push(endWaybackComment);
                        }
                        
                        nodesToRemove.forEach(node => {
                            if (node && node.parentNode) {
                                node.parentNode.removeChild(node);
                            }
                        });
                    }
                }
            }""")