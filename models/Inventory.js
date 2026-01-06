const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    sku: { type: String, unique: true, required: true }, // Stock Keeping Unit
    name: { type: String, required: true },
    quantity: { type: Number, default: 0 }, // total available
    reserved: { type: Number, default: 0 }, // currently reserved
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
