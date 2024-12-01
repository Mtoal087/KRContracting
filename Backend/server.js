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

  query += " LIMIT ?";
  params.push(parseInt(limit));

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ data: rows });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
