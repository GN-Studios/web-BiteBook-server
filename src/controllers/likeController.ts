import { Request, Response } from "express";
import { Like, ILike } from "../models/Like";

// Add a like to a recipe
export const addLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, recipeId } = req.body;

    if (!userId || !recipeId) {
      res.status(400).json({ error: "Please provide userId and recipeId" });
      return;
    }

    // Check if like already exists
    const existingLike = await Like.findOne({ userId, recipeId });
    if (existingLike) {
      res.status(400).json({ error: "User has already liked this recipe" });
      return;
    }

    const like = new Like({ userId, recipeId });
    await like.save();

    res.status(201).json({ message: "Like added successfully", like });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Remove a like from a recipe
export const removeLike = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId, recipeId } = req.body;

    if (!userId || !recipeId) {
      res.status(400).json({ error: "Please provide userId and recipeId" });
      return;
    }

    const like = await Like.findOneAndDelete({ userId, recipeId });

    if (!like) {
      res.status(404).json({ error: "Like not found" });
      return;
    }

    res.status(200).json({ message: "Like removed successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Get likes count for a recipe
export const getLikesCountByRecipeId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { recipeId } = req.params;

    const count = await Like.countDocuments({ recipeId });

    res.status(200).json({ recipeId, likesCount: count });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Get all likes for a recipe
export const getLikesByRecipeId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { recipeId } = req.params;

    const likes = await Like.find({ recipeId })
      .populate("userId", "name email image")
      .sort({ createdAt: -1 });

    res.status(200).json(likes);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Check if user has liked a recipe
export const checkUserLike = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId, recipeId } = req.params;

    const like = await Like.findOne({ userId, recipeId });

    res.status(200).json({ liked: !!like });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Get likes by user ID
export const getLikesByUserId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;

    const likes = await Like.find({ userId })
      .populate("recipeId")
      .sort({ createdAt: -1 });

    res.status(200).json(likes);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
