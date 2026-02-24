import request from "supertest";
import express from "express";
import { commentRouter } from "../commentRoutes";
import { Comment } from "../../models/Comment";

jest.mock("../../models/Comment");

const app = express();
app.use(express.json());
app.use("/api/comments", commentRouter);

describe("Comment Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/comments", () => {
    it("should create a new comment", async () => {
      const newComment = {
        text: "Great recipe!",
        userId: "123",
        recipeId: "456",
      };

      (Comment as any).mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(newComment),
        populate: jest.fn().mockResolvedValue(newComment),
      }));

      const response = await request(app)
        .post("/api/comments")
        .send(newComment);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Comment created successfully");
    });

    it("should return 400 if required fields are missing", async () => {
      const incompleteComment = {
        text: "Great recipe!",
      };

      const response = await request(app)
        .post("/api/comments")
        .send(incompleteComment);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Please provide all required fields");
    });
  });

  describe("GET /api/comments/recipe/:recipeId", () => {
    it("should get all comments for a recipe", async () => {
      const comments = [
        {
          _id: "1",
          text: "Great recipe!",
          userId: "123",
        },
      ];

      (Comment.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(comments),
        }),
      });

      const response = await request(app).get("/api/comments/recipe/456");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/comments/:id", () => {
    it("should get a comment by ID", async () => {
      const comment = { _id: "1", text: "Great recipe!" };

      (Comment.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(comment),
      });

      const response = await request(app).get("/api/comments/1");

      expect(response.status).toBe(200);
    });

    it("should return 404 if comment not found", async () => {
      (Comment.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      const response = await request(app).get("/api/comments/1");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Comment not found");
    });
  });

  describe("PUT /api/comments/:id", () => {
    it("should update a comment", async () => {
      const updatedComment = {
        _id: "1",
        text: "Updated comment",
        save: jest.fn().mockResolvedValue(this),
      };

      (Comment.findById as jest.Mock).mockResolvedValue(updatedComment);

      const response = await request(app)
        .put("/api/comments/1")
        .send({ text: "Updated comment" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Comment updated successfully");
    });

    it("should return 404 if comment not found", async () => {
      (Comment.findById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put("/api/comments/1")
        .send({ text: "Updated comment" });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Comment not found");
    });
  });

  describe("DELETE /api/comments/:id", () => {
    it("should delete a comment", async () => {
      const comment = { _id: "1", text: "Great recipe!" };

      (Comment.findByIdAndDelete as jest.Mock).mockResolvedValue(comment);

      const response = await request(app).delete("/api/comments/1");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Comment deleted successfully");
    });

    it("should return 404 if comment not found", async () => {
      (Comment.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete("/api/comments/1");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Comment not found");
    });
  });
});
