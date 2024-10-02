import argparse
import logging
from pathlib import Path
from typing import List, Tuple
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from logging_config import configure_logging

_logger = logging.getLogger(__name__)


WEBSITE: str = 'https://revenue.stlouisco.com/ias/SearchInput.aspx'
SECURITY_CHECK_ID: str = 'ct100_MainContent_panCaptcha'
IMG_TAG: str ='img'
SECURITY_STRING_ID: str = 'ct100_MainContent_CaptchaVerify1_tboxUserNumber'
SECURITY_SUMBIT_ID: str = 'ct100_MainContent_butCaptchaSubmit'
SEARCH_INPUT_ID: str = 'ctl00_MainContent_tboxLocatorNum'
SUBMIT_BUTTON_ID: str = 'ctl00_MainContent_butFind'
ERROR_MESSAGE_ID: str = 'ctl00_MainContent_ValidationSummary1'
TABLE_ROWS_PATH: str = "//table[@id='ctl00_MainContent_tableData']/tbody/tr"
TD: str = "td"
NEXT_BUTTON_ID: str = 'ctl00_MainContent_lbutPageNext'
NEW_SEARCH_BUTTON_ID: str = 'ctl00_MainContent_contentHeaderLeft'
TIMEOUT: float = 1.0
MAX_DIGIT: int = 10
ALPHA: List[str] = [chr(i) for i in range(ord('A'), ord('Z') + 1)]
ITERATIONS: int = 1


def get_locator_numbers(start: str, end: str) -> List[str]:
    """Get a list of locator numbers to search."""
    locator_numbers: List[str] = []
    current_locator_number: str = start
    while current_locator_number != end:
        locator_numbers.append(current_locator_number)
        first_symbol: StopIteration = current_locator_number[0]
        second_symbol: str = current_locator_number[1]
        third_symbol: chr = current_locator_number[2]
        fourth_symbol: str = current_locator_number[3]
        if fourth_symbol == '9':
            fourth_symbol = '0'
            if third_symbol == 'Z':
                third_symbol = 'A'
                if second_symbol == '9':
                    second_symbol = '0'
                    first_symbol = str(int(current_locator_number[0])+1)
                else:
                    second_symbol = str(int(current_locator_number[1])+1)
            else:
                third_symbol = chr(ord(current_locator_number[2])+1)
        else:
            fourth_symbol =  str(int(fourth_symbol)+1)

        current_locator_number = f"{first_symbol}{second_symbol}{third_symbol}{fourth_symbol}"

    locator_numbers.append(end)
    return locator_numbers


def process_locator_number(driver: webdriver, locator_number: str) -> List[str] | bool:
    """Process a locator number and return the result."""
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

    locator_numbers: List[str] = []
    while True:
        table_rows = driver.find_elements(By.XPATH, TABLE_ROWS_PATH)
        for row in table_rows:
            cells = row.find_elements(By.TAG_NAME, TD)
            if len(cells) > 2:
                if cells[2].text.strip() not in locator_numbers:
                    locator_numbers.append(cells[2].text.strip())
        try:
            next_button = WebDriverWait(driver, TIMEOUT).until(
                EC.element_to_be_clickable((By.ID, NEXT_BUTTON_ID))
            )
            next_button.click()
            WebDriverWait(driver, TIMEOUT).until(
                EC.staleness_of(next_button)
            )
        except Exception:
            break
    # driver.find_element(By.ID, NEW_SEARCH_BUTTON_ID).click()
    return locator_numbers


def find_all_locator_numbers(locator_numbers_to_search: List[str]) -> None:
    """Find all locator numbers."""
    count: int = 0
    while count < ITERATIONS:
        _logger.info(locator_numbers_to_search[0])
        _logger.info(locator_numbers_to_search[-1])

        # Headless Option, alternative just use this line driver = webdriver.Chrome()
        '''options = Options()
        options.add_argument("--headless")
        options.add_argument("--disable-gpu")
        driver = webdriver.Chrome(options=options)'''

        driver = webdriver.Chrome()
        result: List[str] = []
        for locator_number in locator_numbers_to_search:
            driver.get(WEBSITE)
            output = process_locator_number(driver, locator_number)
            security_check: bool = True if isinstance(output, bool) else False
            while security_check:
                driver.quit()
                # Headless Option, alternative just use this line driver = webdriver.Chrome()
                '''options = Options()
                options.add_argument("--headless")
                options.add_argument("--disable-gpu")
                driver = webdriver.Chrome(options=options)'''

                driver = webdriver.Chrome()
                driver.get(WEBSITE)
                output = process_locator_number(driver, locator_number)

                if not isinstance(output, bool):
                    security_check = False
            result.extend(output)
        driver.quit()
        count += 1
        outputfile: Path = Path.cwd() / f"""locator_numbers_{locator_numbers_to_search[0]}_{locator_numbers_to_search[-1]}.txt"""
        text: str = ""
        for number in result:
            text += number + "\n"
        outputfile.write_text(text)
        '''with open(outputfile, 'a') as f:
            f.write(text)'''


def cli() -> Tuple[str, str]:
    """Parse the command line arguments."""
    parser = argparse.ArgumentParser(description="Vulnerability Scanner")
    parser.add_argument(
        "-s",
        "--start",
        type=str,
        default="00A0",
        help="The starting locator number",
    )
    parser.add_argument(
        "-e",
        "--end",
        type=str,
        default="99Z9",
        help="The ending locator number",
    )
    parser.add_argument(
        "-v",
        "--verbose",
        default=False,
        action="store_true",
        help="Log all messages (DEBUG and above)",
    )
    parser.add_argument(
        "-f",
        "--file_logging",
        default=False,
        action="store_true",
        help="Log messages to a file",
    )

    args = parser.parse_args()
    configure_logging(verbose=args.verbose, file_logging=args.file_logging)
    return args.start, args.end


def main() -> None:
    """The main function."""
    start, end = cli()
    locator_numbers_to_search: List[str] = get_locator_numbers(start, end)
    find_all_locator_numbers(locator_numbers_to_search)


if __name__ == "__main__":
    main()
