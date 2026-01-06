import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URL = process.env.MONGO_URL;

const connectDB = async () => {
  await mongoose.connect(MONGO_URL);
  console.log("MongoDB connected");
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("Mongoose default connection closed");
  } catch (error) {
    console.error("Error closing Mongoose connection:", error);
  }
};

export { connectDB, closeDB };
