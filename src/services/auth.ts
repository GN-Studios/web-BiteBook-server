import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { env } from "../config";
import { TokensService } from "./tokens";

export class AuthService {
  static async register(name: string, email: string, password: string, image?: string) {
    const exists = await User.findOne({ email });
    if (exists) throw new Error("Email already exists");

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      ...(image ? { image } : {}),
    });

    return {
      user,
      token: TokensService.signToken(user._id.toString()),
    };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new Error("Invalid email or password");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid email or password");

    return {
      user,
      token: TokensService.signToken(user._id.toString()),
    };
  }
}
