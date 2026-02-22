import "dotenv/config";
import express, { Express, Request, Response } from "express";
import https from "https";
import fs from "fs";
import path from "path";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./db/connection";
import { swaggerSpec } from "./config/swagger";
import userRoutes from "./routes/userRoutes";
import recipeRoutes from "./routes/recipeRoutes";
import commentRoutes from "./routes/commentRoutes";
import likeRoutes from "./routes/likeRoutes";

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Read SSL certificate and key files
const options =
  process.env.IS_HTTPS === "true" &&
  process.env.CERT_PATH &&
  process.env.KEY_PATH
    ? {
        key: fs.readFileSync(path.join(process.env.KEY_PATH)),
        cert: fs.readFileSync(path.join(process.env.CERT_PATH)),
      }
    : undefined;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to BiteBook Server" });
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK" });
});

// User routes
app.use("/api/users", userRoutes);

// Recipe routes
app.use("/api/recipes", recipeRoutes);

// Comment routes
app.use("/api/comments", commentRoutes);

// Like routes
app.use("/api/likes", likeRoutes);

// Connect to MongoDB and start server
const start = async () => {
  try {
    await connectDB();

    if (process.env.IS_HTTPS) {
      // Create HTTPS server
      const server = https.createServer(options!, app);

      server.listen(PORT, () => {
        console.log(`HTTPS Server running on port ${PORT}`);
      });
    } else {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
