const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, "TaxInfoLookup.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Server Is Active!!!");
  }
});

app.get("/data", (req, res) => {
  const {
    cityCode,
    cityName,
    landUseCode,
    schoolDistrict,
    propertyClass,
    limit = 10,
  } = req.query;

  let query = "SELECT * FROM TaxInfoLookup WHERE 1=1";
  const params = [];

  if (cityCode) {
    query += " AND CityCode = ?";
    params.push(cityCode);
  }

  if (cityName) {
    query += " AND CityName LIKE ?";
    params.push(`%${cityName}%`); // Support partial matches
  }

  if (landUseCode) {
    query += " AND LandUseCode = ?";
    params.push(landUseCode);
  }

  if (schoolDistrict) {
    query += " AND SchoolDistrict = ?";
    params.push(schoolDistrict);
  }

  if (propertyClass) {
    query += " AND PropertyClass = ?";
    params.push(propertyClass);
  }

  // Range parameters
  const rangeParams = [
    { from: 'fromTotalAcres', to: 'toTotalAcres', column: 'TotalAcres' },
    { from: 'from2024AppraisedValue', to: 'to2024AppraisedValue', column: 'AppraisedValue2024' },
    { from: 'from2024AssessedTotal', to: 'to2024AssessedTotal', column: 'AssessedTotal2024' },
    { from: 'fromNumberOfYearsWithUnpaidTaxes', to: 'toNumberOfYearsWithUnpaidTaxes', column: 'NumberOfYearsWithUnpaidTaxes' },
    { from: 'fromTotalTaxes', to: 'toTotalTaxes', column: 'TotalTaxes' },
    { from: 'fromTotalInterest', to: 'toTotalInterest', column: 'TotalInterest' },
    { from: 'fromTotalPenalties', to: 'toTotalPenalties', column: 'TotalPenalties' },
    { from: 'fromTotalAmountDue', to: 'toTotalAmountDue', column: 'TotalAmmountDue' },
    { from: 'fromTotalAmountDueOverAppraisedValue2024', to: 'toTotalAmountDueOverAppraisedValue2024', column: 'TotalAmountDueOverAppraisedValue2024' },
    { from: 'fromTotalAmountDueOverAssessedTotal2024', to: 'toTotalAmountDueOverAssessedTotal2024', column: 'TotalAmountDueOverAssessedTotal2024' },
    { from: 'fromTotalTaxesPlusTotalSewerLateralFee', to: 'toTotalTaxesPlusTotalSewerLateralFee', column: 'TotalTaxesPlusTotalSewerLateralFee' },
    // Add other range parameters as needed
  ];

  // Iterate over range parameters and build query
  for (const param of rangeParams) {
    const fromValue = req.query[param.from];
    const toValue = req.query[param.to];

    if (fromValue && toValue) {
      // Exclude NULL values by adding 'AND column IS NOT NULL'
      query += ` AND ${param.column} IS NOT NULL`;
      // Cast the column to REAL for numeric comparison
      query += ` AND CAST(${param.column} AS REAL) BETWEEN ? AND ?`;
      params.push(Number(fromValue), Number(toValue));
    } else if (fromValue || toValue) {
      // If only one is provided, return an error
      return res.status(400).json({ error: `Both ${param.from} and ${param.to} are required.` });
    }
    // If neither is provided, do nothing
  }

  query += " LIMIT ?";
  params.push(parseInt(limit, 10));

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      return res.json({ data: rows });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
