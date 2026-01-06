const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    sku: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
