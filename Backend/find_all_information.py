import logging
import sqlite3 as sql
import shared_functions
from pathlib import Path
from typing import List, Tuple
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException
from selenium.webdriver.common.by import By
import tax_database


WEBSITE: str = 'https://revenue.stlouisco.com/ias/SearchInput.aspx'
SEARCH_TABLE_ROWS_PATH: str = "//table[@id='ctl00_MainContent_tableData']/tbody/tr"
TD: str = "td"
OWNER_TABLE_ROWS_CSS: str = 'table.table.table-bordered'
TR: str = "tr"
ASSESSMENT_TABLE_ROWS_PATH: str = "//table[@id='asmt-year-2024']/tbody/tr" # THIS WILL NEED TO BE UPDATED EVERY YEAR
TAX_INFO_BUTTON_ID: str = 'ctl00_MainContent_NavLinks1_TaxDueLB'
TAXES_ARE_DUE_ID: str = 'ctl00_MainContent_TaxesDueData1_labelPageHeader'
TAX_INFO_TABLE_ID: str = 'ctl00_MainContent_TaxesDueData1_tableTaxDueRE'
POST_THIRDS_ID: str = 'ctl00_MainContent_TaxesDueData1_panelREMessage'
POST_THIRDS_CLASS: str = 'RevImportantText'


def find_all_information(locator_numbers: List[str], _logger: logging.Logger) -> None:
    """Main function to get all of the information for all of the real locator numbers."""
    db, cur = tax_database.create_database()
    result: List[Tuple] = []

    if locator_numbers != []:
        for locator_number in locator_numbers:
            driver = shared_functions.get_driver()
            driver.get(WEBSITE)
            output = get_information(driver, locator_number, cur, _logger)
            security_check: bool = True if isinstance(output, bool) else False
            while security_check:
                driver.quit()
                driver = shared_functions.get_driver()
                driver.get(WEBSITE)
                output = get_information(driver, locator_number, cur, _logger)

                if not isinstance(output, bool):
                    security_check = False
            result.append(output)
            driver.quit()
    else:
        return
    db.commit()
    db.close()

    outputfile: Path = Path.cwd() / f"""locator_numbers_information_{locator_numbers[0]}_{locator_numbers[-1]}.txt"""
    text: str = "---------------------------------------\n"
    for locator_number_information in result:
        for element in locator_number_information:
            text += element + "\n"
        text += "---------------------------------------\n"
    outputfile.write_text(text)


def get_information(driver: webdriver, locator_number: str, cur: sql.Cursor, _logger: logging.Logger) -> Tuple | bool:
    """Function to get the information for a single locator number."""
    _logger.info(locator_number)
    map_link: str = f"https://stlcogis.maps.arcgis.com/apps/webappviewer/index.html?id=e70f8f1814a34cd7bf8f6766bd950c68&query=Parcels,Locator,{locator_number}"
    no_security_check = shared_functions.start_scraping(driver, locator_number)
    if isinstance(no_security_check, bool):
        return False
    
    search_table_rows = driver.find_elements(By.XPATH, SEARCH_TABLE_ROWS_PATH)
    search_table_cells = search_table_rows[0].find_elements(By.TAG_NAME, TD)

    # Click into the page for the locator number
    driver.execute_script("arguments[0].click();", search_table_cells[2])

    # Parse the Owner & Assessment Page
    owner_table = driver.find_element(By.CSS_SELECTOR, OWNER_TABLE_ROWS_CSS)
    owner_table_rows = owner_table.find_elements(By.TAG_NAME, TR)
    
    # Initialize variables to None or empty strings
    tax_year = ""
    tax_district = ""
    city_code = ""
    site_code = ""
    destination_code = ""
    owners_name = ""
    taxing_address = ""
    care_of_name = ""
    mailing_address = ""
    city_name = ""
    subdivision_name = ""
    legal_description = ""
    lot_number = ""
    block_number = ""
    lot_dimensions = ""
    total_acres = ""
    tax_code_description = ""
    land_use_code = ""
    deed_document_number = ""
    school_district = ""
    county_council_district = ""

    # Iterate over the table rows
    for row in owner_table_rows:
        cells = row.find_elements(By.TAG_NAME, "td")
        
        # Check if the row has at least two cells (header and data)
        if len(cells) >= 2:
            header_text = cells[0].text.strip()
            data_text = cells[1].text.strip()
            
            # Assign values to existing variables based on header text
            if header_text == "Tax Year:":
                tax_year = data_text
            elif header_text == "Tax District:":
                tax_district = data_text
            elif header_text == "City Code:":
                city_code = data_text
            elif header_text == "Site Code:":
                site_code = data_text
            elif header_text == "Destination Code:":
                destination_code = data_text
            elif header_text == "Owner's Name:":
                owners_name = data_text
            elif header_text == "Taxing Address:":
                taxing_address = data_text
            elif header_text == "Care-Of Name:":
                care_of_name = data_text
            elif header_text == "Mailing Address:":
                mailing_address = data_text
            elif header_text == "City Name:":
                city_name = data_text
            elif header_text == "Subdivision Name:":
                subdivision_name = data_text
            elif header_text == "Legal Description:":
                legal_description = data_text
            elif header_text == "Lot Number:":
                lot_number = data_text
            elif header_text == "Block Number:":
                block_number = data_text
            elif header_text == "Lot Dimensions:":
                lot_dimensions = data_text
            elif header_text == "Total Acres:":
                total_acres = data_text
            elif header_text == "Tax Code - Description:":
                tax_code_description = data_text
            elif header_text == "Land Use Code:":
                land_use_code = data_text
            elif header_text == "Deed Document Number:":
                deed_document_number = data_text
            elif header_text == "School District:":
                school_district = data_text
            elif header_text == "County Council District:":
                county_council_district = data_text

    # Locate the rows of interest in the assessment table
    assessment_table_rows = driver.find_element(By.XPATH, ASSESSMENT_TABLE_ROWS_PATH)
    property_class: str = assessment_table_rows.find_elements(By.TAG_NAME, TD)[0].text.strip()
    appraised_total: str = assessment_table_rows.find_elements(By.TAG_NAME, TD)[3].text.strip().replace(',', '')
    assessed_total: str = assessment_table_rows.find_elements(By.TAG_NAME, TD)[6].text.strip().replace(',', '')

    tax_history_link = driver.find_element(By.ID, TAX_INFO_BUTTON_ID)
    tax_history_link.click()

    number_of_years_with_unpaid_taxes: str = " "
    total_taxes: str = " "
    total_interest: str = " "
    total_penalties: str = " "
    total_sewer_lateral_fee: str = " "
    total_amount_due: str = " "
    total_amount_due_over_appraised_value: str = " "
    total_amount_due_over_assessed_value: str = " "
    total_taxes_plus_total_sewer_lateral_fee: str = " "
    is_parcel_on_post_thirds_list: str = " "
    is_going_to_be_on_post_third_list: str = " "

    tax_info_title = driver.find_element(By.ID, TAXES_ARE_DUE_ID)
    if tax_info_title.text == "Taxes Are Due":
        table = driver.find_element(By.ID, TAX_INFO_TABLE_ID)
        # Get the rows in the table
        rows = table.find_elements(By.TAG_NAME, "tr")
        # Exclude header and total row for valid data rows
        data_rows = rows[2:-1]  # Adjusted to start from index 2 (first data row) and exclude last row (total)
        # Get the number of years with unpaid taxes
        number_of_years_with_unpaid_taxes: str = str(len(data_rows))
        # Extract the column data (excluding the first column)
        columns = []
        for row in data_rows:
            columns.append([cell.text for cell in row.find_elements(By.TAG_NAME, "td")[1:]])
        # Calculate the sum of each column
        sums = [0] * 5  # Initialize a list to hold sums for each column
        for row in data_rows:
            cells = row.find_elements(By.TAG_NAME, "td")[1:]  # Get cells excluding the first column
            for i, cell in enumerate(cells):
                if i < 5:  # Ensure we don't go out of range
                    sums[i] += float(cell.text.replace('$', '').replace(',', '').strip())  # Clean and convert to float
        total_taxes: str = f"{sums[0]:.2f}"
        total_interest: str = f"{sums[1]:.2f}"
        total_penalties: str = f"{sums[2]:.2f}"
        total_sewer_lateral_fee: str = f"{sums[3]:.2f}"
        total_amount_due: str = f"{sums[4]:.2f}"
        total_amount_due_over_appraised_value: str = f"{(float(total_amount_due)/float(appraised_total)):.2f}"
        total_amount_due_over_assessed_value: str = f"{(float(total_amount_due)/float(assessed_total)):.2f}"
        total_taxes_plus_total_sewer_lateral_fee: str = f"{(float(total_taxes) + float(total_sewer_lateral_fee)):.2f}"
        is_parcel_on_post_thirds_list: str = "False"
        is_going_to_be_on_post_third_list: str = "False"

        retries: int = 3
        tries: int = 0
        while tries < retries:
            try:
                post_message_element = driver.find_element(By.ID, POST_THIRDS_ID)
                if post_message_element.is_displayed():
                    post_thirds_message: str = post_message_element.find_element(By.CLASS_NAME, POST_THIRDS_CLASS).text
                    if "This property will be offered for sale in the August tax sale for the third and final time and sold." in post_thirds_message:
                        is_going_to_be_on_post_third_list = "True"
                    elif "This parcel is on the Post Third Sale List and is subject to sale for unpaid taxes with no redemption period." in post_thirds_message:
                        is_parcel_on_post_thirds_list = "True"
                    break
            except NoSuchElementException:
                break
            except StaleElementReferenceException:
                tries += 1

    data: Tuple = (
        locator_number,
        tax_district,
        site_code,
        tax_year,
        city_code,
        destination_code,
        owners_name,
        taxing_address,
        care_of_name,
        mailing_address,
        city_name,
        subdivision_name,
        legal_description,
        lot_number,
        lot_dimensions,
        block_number,
        total_acres,
        land_use_code,
        tax_code_description,
        deed_document_number,
        school_district,
        county_council_district,
        appraised_total,
        assessed_total,
        property_class,
        number_of_years_with_unpaid_taxes,
        total_taxes,
        total_interest,
        total_penalties,
        total_sewer_lateral_fee,
        total_amount_due,
        is_parcel_on_post_thirds_list,
        is_going_to_be_on_post_third_list,
        map_link,
        total_amount_due_over_appraised_value,
        total_amount_due_over_assessed_value,
        total_taxes_plus_total_sewer_lateral_fee,
    )
    row = tax_database.get_row(cur, data[0])
    if row is None:
        tax_database.insert_row(cur, data)
    else:
        tax_database.update_row(cur, locator_number, data)

    return data
