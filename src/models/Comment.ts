import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  text: string;
  userId: mongoose.Types.ObjectId;
  recipeId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    text: {
      type: String,
      required: [true, "Please provide comment text"],
      trim: true,
      minlength: 1,
      maxlength: 500,
    },
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

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
