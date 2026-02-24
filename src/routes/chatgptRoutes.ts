import { Router } from "express";
import { suggestRecipes } from "../controllers/chatgptController";

export const chatgptRouter = Router();

/**
 * @swagger
 * /api/chatgpt/suggest-recipes:
 *   post:
 *     summary: Generate recipe suggestions from free text input
 *     tags: [ChatGPT]
 *     description: Send a free text input in Hebrew or English describing what you want to cook, and get 1-3 recipe suggestions from ChatGPT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               input:
 *                 type: string
 *                 description: Free text input in Hebrew or English (e.g., "I have chicken and tomatoes", "אני רוצה משהו עם גבינה")
 *             required: [input]
 *           examples:
 *             english:
 *               value:
 *                 input: "I have chicken and potatoes, make something healthy"
 *             hebrew:
 *               value:
 *                 input: "אני רוצה משהו עם ירקות ודגים"
 *     responses:
 *       200:
 *         description: Successfully generated recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 input:
 *                   type: string
 *                   description: The input text provided
 *                 count:
 *                   type: number
 *                   description: Number of recipes generated (1-3)
 *                 recipes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title: { type: string }
 *                       description: { type: string }
 *                       ingredients:
 *                         type: array
 *                         items: { type: string }
 *                       instructions:
 *                         type: array
 *                         items: { type: string }
 *                       prepTime: { type: number }
 *                       cookTime: { type: number }
 *                       servings: { type: number }
 *       400:
 *         description: Bad request or failed to generate recipes
 *       500:
 *         description: Server error
 */
chatgptRouter.post("/suggest-recipes", suggestRecipes);
