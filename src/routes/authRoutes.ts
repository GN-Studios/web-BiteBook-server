import { Router } from "express";
import { AuthController } from "../controllers/authController";

export const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               image: { type: string, nullable: true }
 *     responses:
 *       201:
 *         description: User registered
 */
authRouter.post("/register", AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and receive a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Logged in
 */
authRouter.post("/login", AuthController.login);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     tags: [Auth]
 *     summary: Login with Google OAuth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [credential]
 *             properties:
 *               credential: 
 *                 type: string
 *                 description: Google OAuth credential token
 *     responses:
 *       200:
 *         description: Successfully authenticated with Google
 *       400:
 *         description: Invalid credential
 */
authRouter.post("/google", AuthController.googleLogin);
