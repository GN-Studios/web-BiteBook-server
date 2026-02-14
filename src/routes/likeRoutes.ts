import { Router } from "express";
import {
  addLike,
  removeLike,
  getLikesCountByRecipeId,
  getLikesByRecipeId,
  checkUserLike,
  getLikesByUserId,
} from "../controllers/likeController";

const router = Router();

/**
 * @swagger
 * /api/likes:
 *   post:
 *     summary: Add a like to a recipe
 *     tags: [Likes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId: { type: string }
 *               recipeId: { type: string }
 *             required: [userId, recipeId]
 *     responses:
 *       201:
 *         description: Like added successfully
 *       400:
 *         description: User already liked this recipe or missing fields
 */
router.post("/", addLike);

/**
 * @swagger
 * /api/likes:
 *   delete:
 *     summary: Remove a like from a recipe
 *     tags: [Likes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId: { type: string }
 *               recipeId: { type: string }
 *             required: [userId, recipeId]
 *     responses:
 *       200:
 *         description: Like removed successfully
 *       404:
 *         description: Like not found
 */
router.delete("/", removeLike);

/**
 * @swagger
 * /api/likes/recipe/{recipeId}:
 *   get:
 *     summary: Get all likes for a recipe
 *     tags: [Likes]
 *     parameters:
 *       - name: recipeId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of likes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Like'
 */
router.get("/recipe/:recipeId", getLikesByRecipeId);

/**
 * @swagger
 * /api/likes/recipe/{recipeId}/count:
 *   get:
 *     summary: Get likes count for a recipe
 *     tags: [Likes]
 *     parameters:
 *       - name: recipeId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Likes count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipeId: { type: string }
 *                 likesCount: { type: number }
 */
router.get("/recipe/:recipeId/count", getLikesCountByRecipeId);

/**
 * @swagger
 * /api/likes/check/{userId}/{recipeId}:
 *   get:
 *     summary: Check if user liked a recipe
 *     tags: [Likes]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - name: recipeId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Like status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 liked: { type: boolean }
 */
router.get("/check/:userId/:recipeId", checkUserLike);

/**
 * @swagger
 * /api/likes/user/{userId}:
 *   get:
 *     summary: Get all likes by a user
 *     tags: [Likes]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of recipes liked by user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Like'
 */
router.get("/user/:userId", getLikesByUserId);

export default router;
