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
    offset = 0,
    sortBy,
    order = 'ASC',
  } = req.query;

  // Base queries
  let query = "SELECT * FROM TaxInfoLookup WHERE 1=1";
  let countQuery = "SELECT COUNT(*) as totalCount FROM TaxInfoLookup WHERE 1=1";
  const params = [];
  const countParams = [];

  // Collect conditions
  const conditions = [];
  const conditionParams = [];

  // Specific parameters
  if (cityCode) {
    conditions.push("CityCode = ?");
    conditionParams.push(cityCode);
  }

  if (cityName) {
    conditions.push("CityName LIKE ?");
    conditionParams.push(`%${cityName}%`); // Support partial matches
  }

  if (landUseCode) {
    conditions.push("LandUseCode = ?");
    conditionParams.push(landUseCode);
  }

  if (schoolDistrict) {
    conditions.push("SchoolDistrict LIKE ?");
    conditionParams.push(schoolDistrict);
  }

  if (propertyClass) {
    conditions.push("PropertyClass LIKE ?");
    conditionParams.push(propertyClass);
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
    { from: 'fromTotalAmountDue', to: 'toTotalAmountDue', column: 'TotalAmountDue' },
    { from: 'fromTotalAmountDueOverAppraisedValue2024', to: 'toTotalAmountDueOverAppraisedValue2024', column: 'TotalAmountDueOverAppraisedValue2024' },
    { from: 'fromTotalAmountDueOverAssessedTotal2024', to: 'toTotalAmountDueOverAssessedTotal2024', column: 'TotalAmountDueOverAssessedTotal2024' },
    { from: 'fromTotalTaxesPlusTotalSewerLateralFee', to: 'toTotalTaxesPlusTotalSewerLateralFee', column: 'TotalTaxesPlusTotalSewerLateralFee' },
    // Add other range parameters as needed
  ];

  // Iterate over range parameters and collect conditions
  for (const param of rangeParams) {
    const fromValue = req.query[param.from];
    const toValue = req.query[param.to];

    if (fromValue && toValue) {
      // Exclude NULL values by adding 'AND column IS NOT NULL'
      conditions.push(`${param.column} IS NOT NULL`);
      conditions.push(`CAST(${param.column} AS REAL) BETWEEN ? AND ?`);
      conditionParams.push(Number(fromValue), Number(toValue));
    } else if (fromValue || toValue) {
      // If only one is provided, return an error
      return res.status(400).json({ error: `Both ${param.from} and ${param.to} are required.` });
    }
    // If neither is provided, do nothing
  }

  // Append conditions to queries
  if (conditions.length > 0) {
    const whereClause = conditions.join(' AND ');
    query += ` AND ${whereClause}`;
    countQuery += ` AND ${whereClause}`;
    params.push(...conditionParams);
    countParams.push(...conditionParams);
  }

  // Add sorting if specified
  if (sortBy) {
    query += ` ORDER BY ${sortBy} ${order}`;
  }

  // Finalize main query with LIMIT and OFFSET
  query += " LIMIT ? OFFSET ?";
  params.push(parseInt(limit, 10), parseInt(offset, 10));

  // First, get the total count
  db.get(countQuery, countParams, (err, countResult) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      // Then, execute the main query with LIMIT and OFFSET
      db.all(query, params, (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          return res.json({ data: rows, totalCount: countResult.totalCount });
        }
      });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
