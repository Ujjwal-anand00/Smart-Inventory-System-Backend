const Inventory = require("../models/Inventory");

exports.getInventory = async (req, res) => {
    try {
        const { sku } = req.params;
        const item = await Inventory.findOne({ sku });
        if (!item) return res.status(404).json({ message: "Item not found" });

        res.json({
            sku: item.sku,
            name: item.name,
            available: item.quantity - item.reserved,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
