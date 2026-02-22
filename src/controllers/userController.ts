import { Request, Response } from "express";
import { User } from "../models/User";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, image } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Please provide all required fields" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: "Email already exists" });

    const user = await User.create({ name, email: email.toLowerCase(), password, image: image ?? null });
    const plain = user.toObject();
    delete (plain as any).password;
    res.status(201).json({ message: "User created successfully", user: plain });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Internal server error" });
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Internal server error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, image } = req.body;
    const user = await User.findById(req.params.id).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (typeof image !== "undefined") user.image = image;
    if (password) user.password = password; // hash here if you prefer, or via AuthService only

    await user.save();
    const plain = user.toObject();
    delete (plain as any).password;
    res.status(200).json({ message: "User updated successfully", user: plain });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Internal server error" });
  }
};
