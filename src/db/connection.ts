import mongoose from "mongoose";
import { env } from "../config";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = env.MONGO_URI;

    await mongoose.connect(
      process.env.MONGODB_USERNAME && process.env.MONGODB_PASSWORD
        ? `mongodb://${process.env.MONGODB_USERNAME}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${process.env.MONGODB_HOST}/${process.env.MONGODB_NAME}?authSource=admin`
        : mongoUri,
    );

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
