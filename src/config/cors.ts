import cors from "cors";
import { env } from "./env";

export const corsMiddleware = cors({
  origin: "*", // Allow all origins
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
