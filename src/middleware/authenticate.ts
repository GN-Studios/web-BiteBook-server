import { Request, Response, NextFunction } from "express";
import { TokensService } from "../services";

export function authenticate(req: Request, res: Response, next: NextFunction): Response | void {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = header.split(" ")[1];

  try {
    const payload = TokensService.verifyToken(token);
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
