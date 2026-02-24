import { Request, Response } from "express";
import { AuthService } from "../services";

export const AuthController = {
  register: async (req: Request, res: Response) => {
    try {
      console.log("Register request body:", req.body);
      const { username, name, email, password, image } = req.body;
      const usernameValue = username ?? name;
      
      // Validate required fields (image is optional)
      if (!usernameValue || !email || !password) {
        console.log(
          "Missing fields - username:",
          !!usernameValue,
          "email:",
          !!email,
          "password:",
          !!password,
        );
        return res.status(400).json({ 
          error: "Missing required fields",
          details: {
            username: !usernameValue ? "Username is required" : undefined,
            email: !email ? "Email is required" : undefined,
            password: !password ? "Password is required" : undefined,
          }
        });
      }
      
      // Pass image only if it's provided and not empty
      const imageToUse = image && typeof image === "string" && image.trim().length > 0 ? image : undefined;
      const result = await AuthService.register(usernameValue, email, password, imageToUse);
      console.log("Register successful for user:", email);
      res.status(201).json(result);
    } catch (err: any) {
      console.error("Register error:", err.message);
      res.status(400).json({ error: err.message });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const result = await AuthService.login(username, password);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  googleLogin: async (req: Request, res: Response) => {
    try {
      const { credential } = req.body;
      if (!credential) {
        return res.status(400).json({ error: "Credential is required" });
      }
      const result = await AuthService.googleLogin(credential);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
