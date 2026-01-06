const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const database = require("./config/database");

const inventoryRoutes = require("./routes/inventoryRoutes");
const checkoutRoutes = require("./routes/checkOutRoutes");

dotenv.config();
database.connect();

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  req.url = req.url.trim();
  next();
});


app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.use((req, res, next) => {
  req.url = req.url.replace(/\n|\r/g, "");
  next();
});


app.use("/inventory", inventoryRoutes);
app.use("/checkout", checkoutRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
