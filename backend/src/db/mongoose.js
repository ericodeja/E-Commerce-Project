import mongoose from "mongoose";
import "dotenv/config";

const uri = process.env.MONGO_URL;

if (!uri) {
  throw new Error("MONGO_URL environment variable is not defined");
}

export async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("Successfully connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
}
