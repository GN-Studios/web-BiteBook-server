import { Request, Response } from "express";
import { Comment, IComment } from "../models/Comment";

// Create a new comment
export const createComment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { text, userId, recipeId } = req.body;

    if (!text || !userId || !recipeId) {
      res.status(400).json({ error: "Please provide all required fields" });
      return;
    }

    const comment = new Comment({ text, userId, recipeId });
    await comment.save();

    // Populate user info in response
    await comment.populate("userId", "name email image");

    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Get all comments for a recipe
export const getCommentsByRecipeId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { recipeId } = req.params;
    const comments = await Comment.find({ recipeId })
      .populate("userId", "name email image")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Get comment by ID
export const getCommentById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id).populate(
      "userId",
      "name email image",
    );

    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    res.status(200).json(comment);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Update comment
export const updateComment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    if (text) comment.text = text;

    await comment.save();

    res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Delete comment
export const deleteComment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
