import logging
from contextlib import contextmanager
from typing import Generator

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait

logger = logging.getLogger(__name__)


DEFAULT_WINDOW_SIZE = "1400,1500"
DEFAULT_PAGE_LOAD_TIMEOUT = 30


def _build_chrome_options(headless: bool) -> Options:
    options = Options()
    options.add_argument(f"window-size={DEFAULT_WINDOW_SIZE}")

    if headless:
        options.add_argument("--headless=new")

    # Stability / CI-friendly flags
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--no-sandbox")

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

    Ensures:
    - driver is always quit
    - consistent configuration
    - safe reuse across modules
    """
    options = _build_chrome_options(headless)

    driver = webdriver.Chrome(options=options)
    driver.set_page_load_timeout(page_load_timeout)

    driver.execute_script(
        "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
    )

    logger.debug(
        "Chrome WebDriver started (headless=%s, timeout=%s)",
        headless,
        page_load_timeout,
    )

    try:
        yield driver
    finally:
        logger.debug("Closing Chrome WebDriver")
        driver.quit()


def create_wait(driver: webdriver.Chrome, timeout: int = 30) -> WebDriverWait:
    """Standard WebDriverWait factory."""
    return WebDriverWait(driver, timeout)
