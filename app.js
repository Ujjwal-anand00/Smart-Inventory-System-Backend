const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const database = require("./config/database");

const inventoryRoutes = require("./routes/inventoryRoutes");
const checkoutRoutes = require("./routes/checkOutRoutes");

dotenv.config();

const app = express();
database.connect();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ROUTES
app.use("/inventory", inventoryRoutes);
app.use("/checkout", checkoutRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
