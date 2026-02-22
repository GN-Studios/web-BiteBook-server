import request from "supertest";
import express from "express";
import recipeRoutes from "../recipeRoutes";
import { Recipe } from "../../models/Recipe";

jest.mock("../../models/Recipe");

const app = express();
app.use(express.json());
app.use("/api/recipes", recipeRoutes);

describe("Recipe Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/recipes", () => {
    it("should create a new recipe", async () => {
      const newRecipe = {
        title: "Pasta",
        description: "Delicious pasta",
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        ingredients: [
          { amount: "2 cups", name: "flour" },
          { amount: "1", name: "egg" },
        ],
        instructions: ["Mix flour", "Add egg"],
        userId: "123",
      };

      (Recipe as any).mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(newRecipe),
      }));

      const response = await request(app).post("/api/recipes").send(newRecipe);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Recipe created successfully");
    });

    it("should return 400 if required fields are missing", async () => {
      const incompleteRecipe = {
        title: "Pasta",
        description: "Delicious pasta",
      };

      const response = await request(app)
        .post("/api/recipes")
        .send(incompleteRecipe);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Please provide all required fields");
    });

    it("should return 400 if ingredients are empty", async () => {
      const recipe = {
        title: "Pasta",
        description: "Delicious pasta",
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        ingredients: [],
        instructions: ["Mix flour"],
        userId: "123",
      };

      const response = await request(app).post("/api/recipes").send(recipe);

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/recipes/with-details", () => {
    it("should get all recipes with details and pagination", async () => {
      const mockRecipes = [
        {
          _id: "1",
          title: "Pasta",
          commentsCount: 2,
          likesCount: 5,
        },
      ];

      (Recipe.countDocuments as jest.Mock).mockResolvedValue(1);
      (Recipe.aggregate as jest.Mock).mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockRecipes),
      });

      const response = await request(app).get(
        "/api/recipes/with-details?page=1&limit=10",
      );

      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/recipes/:id", () => {
    it("should get a recipe by ID", async () => {
      const recipe = { _id: "123", title: "Pasta" };

      (Recipe.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(recipe),
      });

      const response = await request(app).get("/api/recipes/123");

      expect(response.status).toBe(200);
    });

    it("should return 404 if recipe not found", async () => {
      (Recipe.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      const response = await request(app).get("/api/recipes/123");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Recipe not found");
    });
  });

  describe("PUT /api/recipes/:id", () => {
    it("should update a recipe", async () => {
      const updatedRecipe = {
        _id: "123",
        title: "Updated Pasta",
        save: jest.fn().mockResolvedValue(this),
      };

      (Recipe.findById as jest.Mock).mockResolvedValue(updatedRecipe);

      const response = await request(app)
        .put("/api/recipes/123")
        .send({ title: "Updated Pasta" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Recipe updated successfully");
    });

    it("should return 404 if recipe not found", async () => {
      (Recipe.findById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put("/api/recipes/123")
        .send({ title: "Updated Pasta" });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Recipe not found");
    });
  });

  describe("DELETE /api/recipes/:id", () => {
    it("should delete a recipe", async () => {
      const recipe = { _id: "123", title: "Pasta" };

      (Recipe.findByIdAndDelete as jest.Mock).mockResolvedValue(recipe);

      const response = await request(app).delete("/api/recipes/123");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Recipe deleted successfully");
    });

    it("should return 404 if recipe not found", async () => {
      (Recipe.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete("/api/recipes/123");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Recipe not found");
    });
  });
});
