const Inventory = require("../models/Inventory");
const Reservation = require("../models/Reservation");

const RESERVATION_TIME = 5 * 60 * 1000; // 5 minutes

// POST /inventory/reserve
exports.reserveItem = async (req, res) => {
    try {
        const { sku, userId, quantity } = req.body;

        if (!sku || !userId || !quantity) 
            return res.status(400).json({ message: "Missing fields" });

        const item = await Inventory.findOne({ sku });
        if (!item) return res.status(404).json({ message: "Item not found" });

        const available = item.quantity - item.reserved;
        if (available < quantity) 
            return res.status(400).json({ message: "Not enough stock" });

        // Check idempotency: does user already have an active reservation?
        let existing = await Reservation.findOne({ sku, userId, status: "active" });
        if (existing) return res.json({ message: "Already reserved", reservationId: existing._id });

        // Create reservation
        const reservation = await Reservation.create({
            sku,
            userId,
            quantity,
            expiresAt: new Date(Date.now() + RESERVATION_TIME),
        });

        item.reserved += quantity;
        await item.save();

        res.json({ message: "Reserved successfully", reservationId: reservation._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /checkout/confirm
exports.confirmCheckout = async (req, res) => {
    try {
        const { reservationId } = req.body;
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) return res.status(404).json({ message: "Reservation not found" });
        if (reservation.status !== "active") return res.status(400).json({ message: "Cannot confirm" });

        // Update inventory
        const item = await Inventory.findOne({ sku: reservation.sku });
        item.quantity -= reservation.quantity;
        item.reserved -= reservation.quantity;
        await item.save();

        reservation.status = "confirmed";
        await reservation.save();

        res.json({ message: "Checkout confirmed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /checkout/cancel
exports.cancelCheckout = async (req, res) => {
    try {
        const { reservationId } = req.body;
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) return res.status(404).json({ message: "Reservation not found" });
        if (reservation.status !== "active") return res.status(400).json({ message: "Cannot cancel" });

        const item = await Inventory.findOne({ sku: reservation.sku });
        item.reserved -= reservation.quantity;
        await item.save();

        reservation.status = "cancelled";
        await reservation.save();

        res.json({ message: "Reservation cancelled" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
