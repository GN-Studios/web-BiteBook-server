import { Router } from "express";
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  getRecipesByUserId,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipeController";

const router = Router();

router.post("/", createRecipe);
router.get("/", getAllRecipes);
router.get("/user/:userId", getRecipesByUserId);
router.get("/:id", getRecipeById);
router.put("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);

export default router;
