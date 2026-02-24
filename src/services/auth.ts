import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User";
import { env } from "../config";
import { TokensService } from "./tokens";

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export class AuthService {
  static async register(
    username: string,
    email: string,
    password: string,
    image?: string,
  ) {
    // Validate input
    if (!username || username.trim().length === 0) {
      throw new Error("Username is required");
    }
    if (!email || email.trim().length === 0) {
      throw new Error("Email is required");
    }
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    const normalizedUsername = username.trim().toLowerCase();
    const usernameExists = await User.findOne({ username: normalizedUsername });
    if (usernameExists) throw new Error("Username already exists");

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) throw new Error("Email already exists");

    const hashed = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({
        username: normalizedUsername,
        name: username.trim(),
        email: email.toLowerCase().trim(),
        password: hashed,
        ...(image && image.trim().length > 0 ? { image: image.trim() } : {}),
      });

      return {
        user,
        token: TokensService.signToken(user._id.toString()),
      };
    } catch (error: any) {
      // Handle mongoose validation errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => err.message);
        throw new Error(messages.join(', '));
      }
      throw error;
    }
  }

  static async login(username: string, password: string) {
    if (!username || username.trim().length === 0) {
      throw new Error("Username is required");
    }
    const normalizedUsername = username.trim().toLowerCase();
    const user = await User.findOne({ username: normalizedUsername }).select("+password");
    if (!user) throw new Error("Invalid username or password");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid username or password");

    return {
      user,
      token: TokensService.signToken(user._id.toString()),
    };
  }

  static async googleLogin(credential: string) {
    try {
      // Verify the Google token
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) throw new Error("Invalid Google token");

      const { email, name, picture } = payload;
      if (!email) throw new Error("Email not provided by Google");
      const normalizedEmail = email.toLowerCase().trim();

      // Find or create user
      let user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        // Create new user with Google info
        // Generate a random password for Google users (they won't use it)
        const randomPassword = await bcrypt.hash(
          Math.random().toString(36),
          10,
        );
        const baseUsername = (normalizedEmail.split("@")[0] || "user")
          .replace(/[^a-z0-9._-]/g, "")
          .toLowerCase();
        const uniqueUsername = await AuthService.generateUniqueUsername(baseUsername || "user");

        user = await User.create({
          username: uniqueUsername,
          name: name || uniqueUsername,
          email: normalizedEmail,
          password: randomPassword,
          image: picture,
        });
      } else {
        // Update user image if provided by Google and not set
        if (picture && !user.image) {
          user.image = picture;
          await user.save();
        }
      }

      return {
        user,
        token: TokensService.signToken(user._id.toString()),
      };
    } catch (error: any) {
      throw new Error(`Google authentication failed: ${error.message}`);
    }
  }

  private static async generateUniqueUsername(base: string) {
    let candidate = base;
    let suffix = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const exists = await User.findOne({ username: candidate });
      if (!exists) return candidate;
      suffix += 1;
      candidate = `${base}${suffix}`;
    }
  }
}
