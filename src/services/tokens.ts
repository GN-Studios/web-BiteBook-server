import jwt, { Secret } from "jsonwebtoken";
import { env } from "../config";

const JWT_SECRET: Secret = env.JWT_ACCESS_SECRET; // You can replace this with env.JWT_ACCESS_SECRET for production

export class TokensService {
  static signToken(userId: string): string {
    console.log(JWT_SECRET);
    return jwt.sign({ id: userId }, JWT_SECRET);
  }

  static verifyToken(token: string): { id: string; iat: number } {
    console.log(JWT_SECRET);
    return jwt.verify(token, JWT_SECRET) as any;
  }
}
