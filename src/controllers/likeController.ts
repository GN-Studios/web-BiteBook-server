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

    const likes = await Like.aggregate([
      { $match: { userId: new (require("mongoose").Types.ObjectId)(userId) } },
      {
        $lookup: {
          from: "recipes",
          localField: "recipeId",
          foreignField: "_id",
          as: "recipeData",
        },
      },
      { $unwind: { path: "$recipeData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "comments",
          localField: "recipeData._id",
          foreignField: "recipeId",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "recipeData._id",
          foreignField: "recipeId",
          as: "recipeLikes",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "recipeData.userId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          recipeId: {
            _id: "$recipeData._id",
            title: "$recipeData.title",
            description: "$recipeData.description",
            image: "$recipeData.image",
            prepTime: "$recipeData.prepTime",
            cookTime: "$recipeData.cookTime",
            servings: "$recipeData.servings",
            ingredients: "$recipeData.ingredients",
            instructions: "$recipeData.instructions",
            author: {
              $cond: {
                if: { $gt: [{ $size: "$author" }, 0] },
                then: {
                  name: { $arrayElemAt: ["$author.name", 0] },
                  email: { $arrayElemAt: ["$author.email", 0] },
                  image: { $arrayElemAt: ["$author.image", 0] },
                },
                else: null,
              },
            },
            commentsCount: { $size: "$comments" },
            likesCount: { $size: "$recipeLikes" },
            createdAt: "$recipeData.createdAt",
            updatedAt: "$recipeData.updatedAt",
          },
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json(likes);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
