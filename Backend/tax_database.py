import sqlite3 as sql
from typing import Tuple

COLUMNS = ["LocatorNumber",
                "TaxDistrict",
                "SiteCode",
                "TaxYear",
                "CityCode",
                "DestinationCode",
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
                "IsGoingToBeOnPostThirdList",
                "MapLink",
                "TotalAmountDueOverAppraisedValue2024",
                "TotalAmountDueOverAssessedTotal2024",
                "TotalTaxesPlusTotalSewerLateralFee"]

def create_database() -> Tuple[sql.Connection, sql.Cursor]:
    db = sql.connect("Backend/TaxInfoLookup.db")
    cur = db.cursor()
    cur.execute("""CREATE TABLE IF NOT EXISTS TaxInfoLookup
                (LocatorNumber TEXT PRIMARY KEY NOT NULL,
                TaxDistrict TEXT,
                SiteCode TEXT,
                TaxYear TEXT,
                CityCode TEXT,
                DestinationCode TEXT,
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
                IsGoingToBeOnPostThirdList TEXT,

                MapLink TEXT,
                
                TotalAmountDueOverAppraisedValue2024 TEXT,
                TotalAmountDueOverAssessedTotal2024 TEXT,
                TotalTaxesPlusTotalSewerLateralFee TEXT)""")
    return (db, cur)

#Insets a row into the database. Requires all 37 atributes to be specified
def insert_row(cur:sql.Cursor, attribute_values:Tuple) -> None:
    cur.execute("INSERT INTO TaxInfoLookup VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", attribute_values)

#Takes a dictionary of column names and values and updates all values in the database under the specified locator number.
def update_row(cur: sql.Cursor, locator_number: str, attribute_values: Tuple)-> None:
    assignments = ", ".join(f"{column} = ?" for column in COLUMNS[1:])
    query = f"UPDATE TaxInfoLookup SET {assignments} WHERE LocatorNumber = ?"
    cur.execute(query, (*attribute_values[1:], locator_number))

#Returns a row from the database with the given primary key
def get_row(cur:sql.Cursor, locator_number: str) -> Tuple:
    return cur.execute("SELECT * FROM TaxInfoLookup WHERE LocatorNumber = ?", (locator_number,)).fetchone()

#Print contents of the database
def display_database(cur:sql.Cursor) -> None:
    database = cur.execute("SELECT * FROM TaxInfoLookup").fetchall()
    for entry in database:
        for column in range(len(COLUMNS)):
            print(COLUMNS[column] + " : " + entry[column])
        print(" ")