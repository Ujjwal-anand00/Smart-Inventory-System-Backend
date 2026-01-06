const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true },
    userId: { type: String, required: true },
    quantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired", "confirmed"],
      default: "active"
    },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

reservationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Reservation", reservationSchema);
