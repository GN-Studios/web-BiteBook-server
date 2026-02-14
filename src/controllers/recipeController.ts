import { Request, Response } from "express";
import { Recipe, IRecipe, IIngredient } from "../models/Recipe";

// Create a new recipe
export const createRecipe = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      title,
      description,
      image,
      prepTime,
      cookTime,
      servings,
      ingredients,
      instructions,
      userId,
    } = req.body;

    if (
      !title ||
      !description ||
      prepTime === undefined ||
      cookTime === undefined ||
      !servings ||
      !ingredients ||
      !instructions ||
      !userId
    ) {
      res.status(400).json({ error: "Please provide all required fields" });
      return;
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      res
        .status(400)
        .json({ error: "Ingredients must be an array with at least one item" });
      return;
    }

    const validIngredients = ingredients.every(
      (ing: any) => ing.amount && ing.name,
    );
    if (!validIngredients) {
      res.status(400).json({
        error: "Each ingredient must have both 'amount' and 'name' properties",
      });
      return;
    }

    if (!Array.isArray(instructions) || instructions.length === 0) {
      res.status(400).json({
        error: "Instructions must be an array with at least one item",
      });
      return;
    }

    const recipe = new Recipe({
      title,
      description,
      image,
      prepTime,
      cookTime,
      servings,
      ingredients,
      instructions,
      userId,
    });
    await recipe.save();

    res.status(201).json({ message: "Recipe created successfully", recipe });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Get all recipes
export const getAllRecipes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const recipes = await Recipe.find().populate("userId", "name email image");
    res.status(200).json(recipes);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Get recipe by ID
export const getRecipeById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id).populate(
      "userId",
      "name email image",
    );

    if (!recipe) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }

    res.status(200).json(recipe);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Get recipes by user ID
export const getRecipesByUserId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const recipes = await Recipe.find({ userId }).populate(
      "userId",
      "name email image",
    );

    res.status(200).json(recipes);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Update recipe
export const updateRecipe = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      image,
      prepTime,
      cookTime,
      servings,
      ingredients,
      instructions,
    } = req.body;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }

    if (title) recipe.title = title;
    if (description) recipe.description = description;
    if (image) recipe.image = image;
    if (prepTime !== undefined) recipe.prepTime = prepTime;
    if (cookTime !== undefined) recipe.cookTime = cookTime;
    if (servings) recipe.servings = servings;
    if (ingredients) recipe.ingredients = ingredients;
    if (instructions) recipe.instructions = instructions;

    await recipe.save();

    res.status(200).json({ message: "Recipe updated successfully", recipe });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// Delete recipe
export const deleteRecipe = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
