import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/bitebook";

    await mongoose.connect(
      mongoUri,
      process.env.MONGODB_USERNAME && process.env.MONGODB_PASSWORD
        ? {
            auth: {
              username: process.env.MONGODB_USERNAME,
              password: process.env.MONGODB_PASSWORD,
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
