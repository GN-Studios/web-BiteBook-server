import mongoose, { Schema, Document } from "mongoose";

export interface IIngredient {
  amount: string;
  name: string;
}

export interface IRecipe extends Document {
  title: string;
  description: string;
  image?: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: IIngredient[];
  instructions: string[];
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const recipeSchema = new Schema<IRecipe>(
  {
    title: {
      type: String,
      required: [true, "Please provide a recipe title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    image: {
      type: String,
      default: null,
    },
    prepTime: {
      type: Number,
      required: [true, "Please provide prep time in minutes"],
      min: 0,
    },
    cookTime: {
      type: Number,
      required: [true, "Please provide cook time in minutes"],
      min: 0,
    },
    servings: {
      type: Number,
      required: [true, "Please provide number of servings"],
      min: 1,
    },
    ingredients: {
      type: [
        {
          amount: {
            type: String,
            required: [true, "Please provide ingredient amount"],
          },
          name: {
            type: String,
            required: [true, "Please provide ingredient name"],
          },
        },
      ],
      required: [true, "Please provide ingredients"],
      validate: {
        validator: function (v: IIngredient[]) {
          return v.length > 0;
        },
        message: "Please provide at least one ingredient",
      },
    },
    instructions: {
      type: [String],
      required: [true, "Please provide cooking instructions"],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: "Please provide at least one instruction",
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user ID"],
    },
  },
  { timestamps: true },
);

export const Recipe = mongoose.model<IRecipe>("Recipe", recipeSchema);
