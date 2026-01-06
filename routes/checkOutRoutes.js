const express = require("express");
const router = express.Router();

const {
  confirmCheckout,
  cancelCheckout
} = require("../controllers/reservationController");

router.post("/confirm", confirmCheckout);
router.post("/cancel", cancelCheckout);

module.exports = router;
