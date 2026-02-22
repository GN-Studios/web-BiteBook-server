import { Request, Response } from "express";
import { AuthService } from "../services";

export const AuthController = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password, image } = req.body;
      const result = await AuthService.register(name, email, password, image);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
