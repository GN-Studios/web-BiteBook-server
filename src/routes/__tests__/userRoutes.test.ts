import request from "supertest";
import express from "express";
import userRoutes from "../userRoutes";
import { User } from "../../models/User";

// Mock mongoose
jest.mock("../../models/User");

const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);

describe("User Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/users", () => {
    it("should create a new user", async () => {
      const newUser = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      (User as any).mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(newUser),
      }));

      (User.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post("/api/users").send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User created successfully");
    });

    it("should return 400 if email already exists", async () => {
      const newUser = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      (User.findOne as jest.Mock).mockResolvedValue({
        email: "john@example.com",
      });

      const response = await request(app).post("/api/users").send(newUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Email already exists");
    });

    it("should return 400 if required fields are missing", async () => {
      const incompleteUser = {
        name: "John Doe",
        email: "john@example.com",
      };

      const response = await request(app)
        .post("/api/users")
        .send(incompleteUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Please provide all required fields");
    });
  });

  describe("GET /api/users", () => {
    it("should get all users", async () => {
      const users = [
        { name: "John", email: "john@example.com" },
        { name: "Jane", email: "jane@example.com" },
      ];

      (User.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(users),
      });

      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/users/:id", () => {
    it("should get a user by ID", async () => {
      const user = { _id: "123", name: "John", email: "john@example.com" };

      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(user),
      });

      const response = await request(app).get("/api/users/123");

      expect(response.status).toBe(200);
    });

    it("should return 404 if user not found", async () => {
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      const response = await request(app).get("/api/users/123");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("User not found");
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should update a user", async () => {
      const updatedUser = {
        _id: "123",
        name: "John Updated",
        email: "john@example.com",
        save: jest.fn().mockResolvedValue(this),
      };

      (User.findById as jest.Mock).mockResolvedValue(updatedUser);

      const response = await request(app)
        .put("/api/users/123")
        .send({ name: "John Updated" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User updated successfully");
    });

    it("should return 404 if user not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put("/api/users/123")
        .send({ name: "John" });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("User not found");
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should delete a user", async () => {
      const user = { _id: "123", name: "John" };

      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(user);

      const response = await request(app).delete("/api/users/123");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User deleted successfully");
    });

    it("should return 404 if user not found", async () => {
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete("/api/users/123");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("User not found");
    });
  });
});
