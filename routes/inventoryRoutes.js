const express = require("express");
const router = express.Router();

const { getInventory } = require("../controllers/inventoryController");
const { reserveItem } = require("../controllers/reservationController");

router.get("/:sku", getInventory);
router.post("/reserve", reserveItem);

module.exports = router;
