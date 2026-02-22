import { Router } from "express";
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  getRecipesByUserId,
  updateRecipe,
  deleteRecipe,
  getAllRecipesWithDetails,
} from "../controllers/recipeController";

const router = Router();

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               image: { type: string }
 *               prepTime: { type: number }
 *               cookTime: { type: number }
 *               servings: { type: number }
 *               ingredients:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Ingredient'
 *               instructions:
 *                 type: array
 *                 items: { type: string }
 *               userId: { type: string }
 *             required: [title, description, prepTime, cookTime, servings, ingredients, instructions, userId]
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", createRecipe);

/**
 * @swagger
 * /api/recipes/with-details:
 *   get:
 *     summary: Get all recipes with comments and likes count (paginated)
 *     tags: [Recipes]
 *     parameters:
 *       - name: page
 *         in: query
 *         schema: { type: number, default: 1 }
 *       - name: limit
 *         in: query
 *         schema: { type: number, default: 10 }
 *     responses:
 *       200:
 *         description: List of recipes with details
 */
router.get("/with-details", getAllRecipesWithDetails);

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Get all recipes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: List of all recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get("/", getAllRecipes);

/**
 * @swagger
 * /api/recipes/user/{userId}:
 *   get:
 *     summary: Get recipes by user ID
 *     tags: [Recipes]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of user's recipes
 */
router.get("/user/:userId", getRecipesByUserId);

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Get recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Recipe found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found
 */
router.get("/:id", getRecipeById);

/**
 * @swagger
 * /api/recipes/{id}:
 *   put:
 *     summary: Update recipe
 *     tags: [Recipes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               image: { type: string }
 *               prepTime: { type: number }
 *               cookTime: { type: number }
 *               servings: { type: number }
 *               ingredients:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Ingredient'
 *               instructions:
 *                 type: array
 *                 items: { type: string }
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *       404:
 *         description: Recipe not found
 */
router.put("/:id", updateRecipe);

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     summary: Delete recipe
 *     tags: [Recipes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Recipe deleted successfully
 *       404:
 *         description: Recipe not found
 */
router.delete("/:id", deleteRecipe);

export default router;
