const express = require("express");
const dotenv = require("dotenv");

const cors = require("cors");
const database = require("./config/database");

dotenv.config();

const app = express();
database.connect();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
