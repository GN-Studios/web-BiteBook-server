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

router.post("/", addLike);
router.delete("/", removeLike);
router.get("/recipe/:recipeId", getLikesByRecipeId);
router.get("/recipe/:recipeId/count", getLikesCountByRecipeId);
router.get("/check/:userId/:recipeId", checkUserLike);
router.get("/user/:userId", getLikesByUserId);

export default router;
