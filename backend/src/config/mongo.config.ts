import mongoose from "mongoose";
import { env } from "./env.config";
export async function connectDB() {
  const MONGO_URL = env.MONGO_URL as string;
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to mongodb 🚀");
  } catch (error) {
    console.log("Mongo Error, ", error);
  }
}
