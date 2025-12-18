import logging
import random
from time import sleep
from typing import Tuple

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException

logger = logging.getLogger(__name__)


# -----------------------------
# Chrome configuration
# -----------------------------
def _build_chrome_options(headless: bool = True) -> Options:
    options = Options()

    if headless:
        # Use modern headless mode (critical for CI)
        options.add_argument("--headless=new")

    # Required for CI / GitHub Actions
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    # Stability / performance
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-infobars")
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-background-networking")
    options.add_argument("--disable-features=Translate,BackForwardCache")

    # Rendering consistency
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--lang=en-US")

    # Reduce bot fingerprinting
    options.add_argument(
        "--user-agent=Mozilla/5.0 (X11; Linux x86_64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )

    return options


# -----------------------------
# WebDriver factory
# -----------------------------
def create_webdriver(*, headless: bool = True, timeout: int = 30) -> webdriver.Chrome:
    """
    Create a hardened Chrome WebDriver + WebDriverWait.

    Always use this factory. Never instantiate drivers directly.
    """
    options = _build_chrome_options(headless=headless)

    driver = webdriver.Chrome(options=options)
    driver.set_page_load_timeout(timeout)

    return driver


def create_wait(
    driver: webdriver.Chrome,
    timeout: int = 30,
) -> WebDriverWait:
    """Standard WebDriverWait factory."""
    return WebDriverWait(driver, timeout)


# -----------------------------
# Navigation helpers
# -----------------------------
def safe_get(
    driver: webdriver.Chrome,
    url: str,
    *,
    retries: int = 3,
    retry_delay: float = 2.0,
) -> None:
    """
    Navigate to a URL with retries and jitter.
    """
    for attempt in range(1, retries + 1):
        try:
            logger.info("Navigating to %s (attempt %d)", url, attempt)
            driver.get(url)
            return
        except (TimeoutException, WebDriverException) as exc:
            if attempt == retries:
                logger.error("Failed to load %s", url)
                raise

            jitter = random.uniform(0.5, 1.5)
            logger.warning(
                "Navigation failed (%s), retrying in %.2fs",
                exc.__class__.__name__,
                retry_delay + jitter,
            )
            sleep(retry_delay + jitter)


# -----------------------------
# Scrolling / lazy-load helpers
# -----------------------------
def scroll_to_bottom(
    driver: webdriver.Chrome,
    *,
    pause: float = 0.5,
    max_attempts: int = 10,
) -> None:
    """
    Force lazy-loaded content to render (critical in headless mode).
    """
    last_height = driver.execute_script("return document.body.scrollHeight")

    for _ in range(max_attempts):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        sleep(pause)

        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height


# -----------------------------
# Amazon-specific waits
# -----------------------------
# def wait_for_amazon_list_items(
#     driver: webdriver.Chrome,
#     wait: WebDriverWait,
#     *,
#     min_items: int = 5,
# ) -> None:
#     """
#     Wait until Amazon wishlist items are *actually rendered*.

#     presence_of_element_located is NOT sufficient on Linux headless.
#     """
#     logger.info("Waiting for Amazon wishlist container")

#     wait.until(EC.visibility_of_element_located((By.ID, "g-items")))

#     logger.info("Waiting for wishlist items to populate")

#     wait.until(
#         lambda d: len(d.find_elements(By.CSS_SELECTOR, "#g-items li")) >= min_items
#     )


def wait_for_amazon_list_items(
    driver, pause_seconds: float = 1.5, max_attempts: int = 20
):
    """
    Scroll down until no new content loads.
    """
    last_height = 0

    for _ in range(max_attempts):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        sleep(pause_seconds)

        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            return

        last_height = new_height


# -----------------------------
# Utility helpers
# -----------------------------
def random_delay(min_seconds: float = 1.0, max_seconds: float = 3.0) -> None:
    """
    Add jitter between actions to reduce throttling.
    """
    sleep(random.uniform(min_seconds, max_seconds))
