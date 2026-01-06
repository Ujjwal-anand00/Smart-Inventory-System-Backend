const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true },
    userId: { type: String, required: true }, // who reserved
    quantity: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired", "confirmed"],
      default: "active",
    },
    expiresAt: { type: Date, required: true }, // 5 min expiry
  },
  { timestamps: true }
);

// Auto expire reservation
reservationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Reservation", reservationSchema);
