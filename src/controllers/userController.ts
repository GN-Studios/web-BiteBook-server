import { Request, Response } from "express";
import { User, IUser } from "../models/User";

// Create a new user
export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Please provide all required fields" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "User created successfully", user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Get all users
export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Get user by ID
export const getUserById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Update user
export const updateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Delete user
export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
