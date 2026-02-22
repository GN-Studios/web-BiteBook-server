import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const EXPIRES_IN = "7d"; // example: "1h", "24h", "7d"

export class TokensService {
  static signToken(userId: string): string {
    return jwt.sign({ id: userId }, JWT_SECRET);
  }

  static verifyToken(token: string): { id: string; iat: number; exp: number } {
    return jwt.verify(token, JWT_SECRET) as any;
  }
}
