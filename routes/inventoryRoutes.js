const express = require("express");
const router = express.Router();
const { getInventory } = require("../controllers/inventoryControllers");
const { reserveItem } = require("../controllers/reservationControllers");

router.get("/:sku", getInventory);
router.post("/reserve", reserveItem);

module.exports = router;
