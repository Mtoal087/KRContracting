import sqlite3 as sql
from typing import Tuple

COLUMNS = ["LocatorNumber",
                "TaxDistrict",
                "SiteCode",
                "TaxYear",
                "CityCode",
                "OwnersName",
                "TaxingAddress",
                "CareOfName",
                "MailingAddress",
                "CityName",
                "SubdivisionName",
                "LegalDescrition",
                "LotNumber",
                "LotDimensions",
                "BlockNumber",
                "TotalAcres",
                "LandUseCode",
                "TaxCodeDescritpion",
                "DeedDocumentNumber",
                "SchoolDistrict",
                "CountyCouncilDistrict",
                "AppraisedValue2024",
                "AssessedTotal2024",
                "PropertyClass",
                "NumberOfYearsWithUnpaidTaxes",
                "TotalTaxes",
                "TotalInterest",
                "TotalPenalties",
                "TotalSewerLateralFee",
                "TotalAmmountDue",
                "IsParcelOnPostThirdsList",
                "IsPropertyOnPostThirdList",
                "MapLink"]

def create_database() -> sql.Cursor:
    db = sql.connect("TaxInfoLookup.db")
    cur = db.cursor()
    cur.execute("""CREATE TABLE IF NOT EXISTS TaxInfoLookup
                (LocatorNumber TEXT PRIMARY KEY NOT NULL,
                TaxDistrict TEXT,
                SiteCode TEXT,
                TaxYear TEXT,
                CityCode TEXT,
                OwnersName TEXT,
                TaxingAddress TEXT,
                CareOfName TEXT,
                MailingAddress TEXT,
                CityName TEXT,
                SubdivisionName TEXT,
                LegalDescrition TEXT,
                LotNumber TEXT,
                LotDimensions TEXT,
                BlockNumber TEXT,
                TotalAcres TEXT,
                LandUseCode TEXT,
                TaxCodeDescritpion TEXT,
                DeedDocumentNumber TEXT,
                SchoolDistrict TEXT,
                CountyCouncilDistrict TEXT,
                AppraisedValue2024 TEXT,
                AssessedTotal2024 TEXT,
                PropertyClass TEXT,

                NumberOfYearsWithUnpaidTaxes TEXT,
                TotalTaxes TEXT,
                TotalInterest TEXT,
                TotalPenalties TEXT,
                TotalSewerLateralFee TEXT,
                TotalAmmountDue TEXT,
                IsParcelOnPostThirdsList TEXT,
                IsPropertyOnPostThirdList TEXT,

                MapLink TEXT)""")
    return cur

#Insets a row into the database. Requires all 33 atributes to be specified
def insert_row(cur:sql.Cursor, attribute_values:Tuple) -> None:
    cur.execute("INSERT INTO TaxInfoLookup VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", attribute_values)

#Takes a dictionary of column names and values and updates all values in the database under the specified locator number.
def update_row(cur:sql.Cursor, locator_number: str, attributes:dict)-> None:
    for column in attributes:
        value = attributes[column]
        if column in COLUMNS:     
            cur.execute(f"UPDATE TaxInfoLookup SET {column} = ? WHERE LocatorNumber = ?", (value, locator_number))

#Returns a row from the database with the given primary key
def get_row(cur:sql.Cursor, locator_number: str) -> Tuple:
    return cur.execute("SELECT * FROM TaxInfoLookup WHERE LocatorNumber = ?", (locator_number,)).fetchone()
