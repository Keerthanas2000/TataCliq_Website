const mongoose = require("mongoose");

const connecttoDb = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MOngo success"))
    .catch((err) => console.log(err));
};

module.exports = connecttoDb;
