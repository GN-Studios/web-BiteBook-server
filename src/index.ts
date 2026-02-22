import "dotenv/config";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./db/connection";
import { swaggerSpec } from "./config/swagger";
import { userRouter, commentRouter, recipeRouter, likeRouter, authRouter } from "./routes";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./config";

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(corsMiddleware);

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
app.use("/api/users", userRouter);
app.use("/api/recipes", recipeRouter);
app.use("/api/comments", commentRouter);
app.use("/api/likes", likeRouter);
app.use("/auth", authRouter);

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
