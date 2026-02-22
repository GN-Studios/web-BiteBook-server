import mongoose, { Schema, Document } from "mongoose";

export interface ILike extends Document {
  userId: mongoose.Types.ObjectId;
  recipeId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user ID"],
    },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: [true, "Please provide a recipe ID"],
    },
  },
  { timestamps: true },
);

// Ensure a user can only like a recipe once
likeSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

export const Like = mongoose.model<ILike>("Like", likeSchema);
