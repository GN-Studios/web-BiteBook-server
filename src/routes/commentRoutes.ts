import { Router } from "express";
import {
  createComment,
  getCommentsByRecipeId,
  getCommentById,
  updateComment,
  deleteComment,
} from "../controllers/commentController";

export const commentRouter = Router();

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text: { type: string }
 *               userId: { type: string }
 *               recipeId: { type: string }
 *             required: [text, userId, recipeId]
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Bad request
 */
commentRouter.post("/", createComment);

/**
 * @swagger
 * /api/comments/recipe/{recipeId}:
 *   get:
 *     summary: Get all comments for a recipe
 *     tags: [Comments]
 *     parameters:
 *       - name: recipeId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
commentRouter.get("/recipe/:recipeId", getCommentsByRecipeId);

/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     summary: Get comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Comment found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 */
commentRouter.get("/:id", getCommentById);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Update comment
 *     tags: [Comments]
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
 *               text: { type: string }
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       404:
 *         description: Comment not found
 */
commentRouter.put("/:id", updateComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete comment
 *     tags: [Comments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 */
commentRouter.delete("/:id", deleteComment);
