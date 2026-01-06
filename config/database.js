const mongoose = require("mongoose");

exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB connection successful");
  } catch (err) {
    console.error("DB connection failed");
    console.error(err.message);
    process.exit(1);
  }
};
