import { Router } from "express";
import {
  createComment,
  getCommentsByRecipeId,
  getCommentById,
  updateComment,
  deleteComment,
} from "../controllers/commentController";

const router = Router();

router.post("/", createComment);
router.get("/recipe/:recipeId", getCommentsByRecipeId);
router.get("/:id", getCommentById);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;
