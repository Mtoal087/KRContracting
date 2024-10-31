from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By


SEARCH_INPUT_ID: str = 'ctl00_MainContent_tboxLocatorNum'
SUBMIT_BUTTON_ID: str = 'ctl00_MainContent_butFind'
ERROR_MESSAGE_ID: str = 'ctl00_MainContent_ValidationSummary1'


def get_driver() -> webdriver:
    """Get a webdriver instance."""
    # Headless Option, alternative just use this line driver = webdriver.Chrome()
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.binary_location = "/usr/bin/google-chrome"
    driver = webdriver.Chrome(options=options)

    # driver = webdriver.Chrome()
    return driver


def start_scraping(driver: webdriver, locator_number: str) -> bool | None:
    """Logic to start scraping the website."""
    driver.find_element(By.ID, SEARCH_INPUT_ID).clear()
    driver.find_element(By.ID, SEARCH_INPUT_ID).send_keys(locator_number)
    driver.find_element(By.ID, SUBMIT_BUTTON_ID).click()
    
    retries: int = 3
    tries: int = 0
    while tries < retries:
        try:
            error_message_element = driver.find_element(By.ID, ERROR_MESSAGE_ID)
            if error_message_element.is_displayed():
                return []
        except NoSuchElementException:
            break
        except StaleElementReferenceException:
            tries += 1
            

    if driver.title.replace("\n", "").strip() == "Search Security Check":
        return False