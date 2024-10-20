import argparse
import logging
import shared_functions
from pathlib import Path
from typing import List, Tuple
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from logging_config import configure_logging
from find_all_information import find_all_information

_logger = logging.getLogger(__name__)


WEBSITE: str = 'https://revenue.stlouisco.com/ias/SearchInput.aspx'
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
    _logger.info(locator_number)
    no_security_check = shared_functions.start_scraping(driver, locator_number)
    if isinstance(no_security_check, bool):
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

    return locator_numbers


def find_all_locator_numbers(locator_numbers_to_search: List[str]) -> List[str]:
    """Find all locator numbers."""
    count: int = 0
    while count < ITERATIONS:
        _logger.info(locator_numbers_to_search[0])
        _logger.info(locator_numbers_to_search[-1])

        result: List[str] = []
        for locator_number in locator_numbers_to_search:
            driver = shared_functions.get_driver()
            driver.get(WEBSITE)
            output = process_locator_number(driver, locator_number)
            security_check: bool = True if isinstance(output, bool) else False
            while security_check:
                driver.quit()
                driver = shared_functions.get_driver()
                driver.get(WEBSITE)
                output = process_locator_number(driver, locator_number)

                if not isinstance(output, bool):
                    security_check = False
            result.extend(output)
            driver.quit()
            find_all_information(output, _logger)
        count += 1
        outputfile: Path = Path.cwd() / f"""locator_numbers_{locator_numbers_to_search[0]}_{locator_numbers_to_search[-1]}.txt"""
        text: str = ""
        for number in result:
            text += number + "\n"
        outputfile.write_text(text)
        return result


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
