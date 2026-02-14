import "dotenv/config";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./db/connection";

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to BiteBook Server" });
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK" });
});

// Connect to MongoDB and start server
const start = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
