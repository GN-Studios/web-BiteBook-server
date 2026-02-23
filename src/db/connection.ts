import mongoose from "mongoose";
import { env } from "../config";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = env.MONGO_URI;

    await mongoose.connect(
      mongoUri,
      env.MONGODB_USERNAME && env.MONGODB_PASSWORD
        ? {
            auth: {
              username: env.MONGODB_USERNAME,
              password: env.MONGODB_PASSWORD,
            },
          }
        : undefined,
    );

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
