import request from "supertest";
import express from "express";
import { likeRouter } from "../likeRoutes";
import { Like } from "../../models/Like";

jest.mock("../../models/Like");
jest.mock("mongoose", () => ({
  ...jest.requireActual("mongoose"),
  Types: {
    ObjectId: jest.fn((id) => id),
  },
}));

const app = express();
app.use(express.json());
app.use("/api/likes", likeRouter);

describe("Like Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/likes", () => {
    it("should add a like", async () => {
      const newLike = {
        userId: "123",
        recipeId: "456",
      };

      (Like.findOne as jest.Mock).mockResolvedValue(null);
      (Like as any).mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(newLike),
      }));

      const response = await request(app).post("/api/likes").send(newLike);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Like added successfully");
    });

    it("should return 400 if user already liked the recipe", async () => {
      const like = {
        userId: "123",
        recipeId: "456",
      };

      (Like.findOne as jest.Mock).mockResolvedValue(like);

      const response = await request(app).post("/api/likes").send(like);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("User has already liked this recipe");
    });

    it("should return 400 if required fields are missing", async () => {
      const incompleteLike = {
        userId: "123",
      };

      const response = await request(app)
        .post("/api/likes")
        .send(incompleteLike);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Please provide userId and recipeId");
    });
  });

  describe("DELETE /api/likes", () => {
    it("should remove a like", async () => {
      const like = {
        userId: "123",
        recipeId: "456",
      };

      (Like.findOneAndDelete as jest.Mock).mockResolvedValue(like);

      const response = await request(app).delete("/api/likes").send(like);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Like removed successfully");
    });

    it("should return 404 if like not found", async () => {
      const like = {
        userId: "123",
        recipeId: "456",
      };

      (Like.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete("/api/likes").send(like);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Like not found");
    });
  });

  describe("GET /api/likes/recipe/:recipeId/count", () => {
    it("should get likes count for a recipe", async () => {
      (Like.countDocuments as jest.Mock).mockResolvedValue(5);

      const response = await request(app).get("/api/likes/recipe/456/count");

      expect(response.status).toBe(200);
      expect(response.body.likesCount).toBe(5);
    });
  });

  describe("GET /api/likes/recipe/:recipeId", () => {
    it("should get all likes for a recipe", async () => {
      const likes = [
        {
          _id: "1",
          userId: "123",
        },
      ];

      (Like.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(likes),
        }),
      });

      const response = await request(app).get("/api/likes/recipe/456");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/likes/check/:userId/:recipeId", () => {
    it("should check if user liked a recipe", async () => {
      const like = {
        userId: "123",
        recipeId: "456",
      };

      (Like.findOne as jest.Mock).mockResolvedValue(like);

      const response = await request(app).get("/api/likes/check/123/456");

      expect(response.status).toBe(200);
      expect(response.body.liked).toBe(true);
    });

    it("should return false if user did not like recipe", async () => {
      (Like.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get("/api/likes/check/123/456");

      expect(response.status).toBe(200);
      expect(response.body.liked).toBe(false);
    });
  });

  describe("GET /api/likes/user/:userId", () => {
    it("should get all likes by a user", async () => {
      const likes = [
        {
          _id: "1",
          userId: "123",
          recipeId: "456",
          recipeData: {
            _id: "456",
            title: "Test Recipe",
          },
          commentsCount: 5,
          likesCount: 10,
        },
      ];

      (Like.aggregate as jest.Mock).mockResolvedValue(likes);

      const response = await request(app).get("/api/likes/user/123");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
