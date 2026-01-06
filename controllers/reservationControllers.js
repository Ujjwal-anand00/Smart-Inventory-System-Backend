const Inventory = require("../models/Inventory");
const Reservation = require("../models/Reservation");

const RESERVATION_TIME = 5 * 60 * 1000;

exports.reserveItem = async (req, res) => {
  try {
    let { sku, userId, quantity } = req.body;

    if (!sku || !userId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    sku = sku.trim().toUpperCase();

    const existing = await Reservation.findOne({
      sku,
      userId,
      status: "active"
    });

    if (existing) {
      return res.json({
        message: "Already reserved",
        reservationId: existing._id
      });
    }

    const item = await Inventory.findOneAndUpdate(
      {
        sku,
        $expr: {
          $gte: [
            { $subtract: ["$quantity", "$reserved"] },
            quantity
          ]
        }
      },
      { $inc: { reserved: quantity } },
      { new: true }
    );

    if (!item) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    const reservation = await Reservation.create({
      sku,
      userId,
      quantity,
      expiresAt: new Date(Date.now() + RESERVATION_TIME)
    });

    res.json({
      message: "Reserved successfully",
      reservationId: reservation._id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.confirmCheckout = async (req, res) => {
  try {
    const { reservationId } = req.body;

    const reservation = await Reservation.findOneAndUpdate(
      { _id: reservationId, status: "active" },
      { status: "confirmed" },
      { new: true }
    );

    if (!reservation) {
      return res.status(400).json({ message: "Invalid reservation" });
    }

    const item = await Inventory.findOneAndUpdate(
      { sku: reservation.sku },
      {
        $inc: {
          quantity: -reservation.quantity,
          reserved: -reservation.quantity
        }
      },
      { new: true }
    );

    if (!item) {
      return res.status(500).json({ message: "Inventory corrupted" });
    }

    res.json({ message: "Checkout confirmed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelCheckout = async (req, res) => {
  try {
    const { reservationId } = req.body;

    const reservation = await Reservation.findOneAndUpdate(
      { _id: reservationId, status: "active" },
      { status: "cancelled" },
      { new: true }
    );

    if (!reservation) {
      return res.status(400).json({ message: "Invalid reservation" });
    }

    await Inventory.findOneAndUpdate(
      { sku: reservation.sku },
      { $inc: { reserved: -reservation.quantity } }
    );

    res.json({ message: "Reservation cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
