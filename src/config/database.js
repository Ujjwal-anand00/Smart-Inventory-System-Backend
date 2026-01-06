const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB ka connection sucessful"))
    .catch((err) => {
      console.log("DB ka connection failed");
      console.error(err);
      process.exit(1);
    });
};
