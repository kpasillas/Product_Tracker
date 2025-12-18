import logging
import time
from contextlib import contextmanager
from typing import Generator, Optional

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────
# Defaults tuned for headless Linux + Amazon
# ─────────────────────────────────────────────────────────────

DEFAULT_WINDOW_WIDTH = 1400
DEFAULT_WINDOW_HEIGHT = 2000
DEFAULT_PAGE_LOAD_TIMEOUT = 30
DEFAULT_WAIT_TIMEOUT = 30


# ─────────────────────────────────────────────────────────────
# Chrome configuration
# ─────────────────────────────────────────────────────────────


def _build_chrome_options(headless: bool) -> Options:
    options = Options()

    options.add_argument(
        f"--window-size={DEFAULT_WINDOW_WIDTH},{DEFAULT_WINDOW_HEIGHT}"
    )

    if headless:
        # New headless mode is much more reliable
        options.add_argument("--headless=new")

    # Required for Linux VPS stability
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    # Reduce automation fingerprinting
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)

    return options


@contextmanager
def create_webdriver(
    *,
    headless: bool = True,
    page_load_timeout: int = DEFAULT_PAGE_LOAD_TIMEOUT,
) -> Generator[webdriver.Chrome, None, None]:
    """
    Context-managed Chrome WebDriver factory.

    Guarantees:
    - proper cleanup
    - consistent configuration
    - Linux + headless compatibility
    """
    options = _build_chrome_options(headless)
    driver = webdriver.Chrome(options=options)

    driver.set_page_load_timeout(page_load_timeout)

    # Further reduce detection
    driver.execute_script(
        "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
    )

    logger.debug("Chrome WebDriver started (headless=%s)", headless)

    try:
        yield driver
    finally:
        logger.debug("Closing Chrome WebDriver")
        driver.quit()


def create_wait(
    driver: webdriver.Chrome,
    timeout: int = DEFAULT_WAIT_TIMEOUT,
) -> WebDriverWait:
    """Standard WebDriverWait factory."""
    return WebDriverWait(driver, timeout)


# ─────────────────────────────────────────────────────────────
# Amazon-safe scrolling & waits
# ─────────────────────────────────────────────────────────────


def scroll_until_complete(
    driver: webdriver.Chrome,
    *,
    pause_seconds: float = 1.5,
    max_attempts: int = 25,
) -> None:
    """
    Incrementally scroll the page until no new content loads.

    Critical for:
    - Amazon wishlist pages
    - headless Linux Chrome
    """
    last_height = 0

    for attempt in range(max_attempts):
        driver.execute_script("window.scrollBy(0, document.body.scrollHeight);")
        time.sleep(pause_seconds)

        new_height = driver.execute_script("return document.body.scrollHeight")

        logger.debug(
            "Scroll attempt %d: height %s → %s",
            attempt + 1,
            last_height,
            new_height,
        )

        if new_height == last_height:
            return

        last_height = new_height

    logger.warning("Reached max scroll attempts without settling")


def wait_for_dom_items(
    driver: webdriver.Chrome,
    *,
    container_id: str,
    item_selector: Optional[str] = None,
    timeout: int = DEFAULT_WAIT_TIMEOUT,
) -> None:
    """
    Wait for a container (and optionally its children) to exist in the DOM.

    This avoids Selenium's fragile `presence_of_element_located`
    on lazy-loaded JS sites.
    """
    end = time.time() + timeout

    while time.time() < end:
        exists = driver.execute_script(
            """
            const container = document.getElementById(arguments[0]);
            if (!container) return false;

            if (!arguments[1]) return true;

            return container.querySelectorAll(arguments[1]).length > 0;
            """,
            container_id,
            item_selector,
        )

        if exists:
            return

        # Trigger IntersectionObserver / lazy loading
        driver.execute_script("window.scrollBy(0, window.innerHeight);")
        time.sleep(1)

    raise TimeoutException(
        f"Timed out waiting for #{container_id}"
        + (f" {item_selector}" if item_selector else "")
    )


def wait_for_amazon_wishlist_items(
    driver: webdriver.Chrome,
    timeout: int = DEFAULT_WAIT_TIMEOUT,
) -> None:
    """
    Amazon-specific wait for wishlist items to fully load.
    """
    logger.debug("Waiting for Amazon wishlist items")

    scroll_until_complete(driver)

    wait_for_dom_items(
        driver,
        container_id="g-items",
        item_selector="li",
        timeout=timeout,
    )
