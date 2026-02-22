import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BiteBook API",
      version: "1.0.0",
      description:
        "API documentation for BiteBook Server - A recipe sharing platform",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            image: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Ingredient: {
          type: "object",
          properties: {
            amount: { type: "string" },
            name: { type: "string" },
          },
          required: ["amount", "name"],
        },
        Recipe: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            image: { type: "string", nullable: true },
            prepTime: { type: "number" },
            cookTime: { type: "number" },
            servings: { type: "number" },
            ingredients: {
              type: "array",
              items: { $ref: "#/components/schemas/Ingredient" },
            },
            instructions: {
              type: "array",
              items: { type: "string" },
            },
            author: { $ref: "#/components/schemas/User" },
            commentsCount: { type: "number" },
            likesCount: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Comment: {
          type: "object",
          properties: {
            _id: { type: "string" },
            text: { type: "string" },
            userId: { type: "string" },
            recipeId: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Like: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            recipeId: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
