const mongoose = require("mongoose");

const connecttoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || "mongodb://mongo-container:27017/StarlinkDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connecttoDb;