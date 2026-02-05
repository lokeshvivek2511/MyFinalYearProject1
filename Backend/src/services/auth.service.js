import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import User from "../models/User.model.js";

export const hashPassword = async (plain) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

export const comparePassword = async (plain, hash) => {
  return bcrypt.compare(plain, hash);
};

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    config.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const createUser = async (payload) => {
  const exists = await User.findOne({ phone: payload.phone });
  if (exists) throw new Error("User already exists");

  const password = await hashPassword(payload.password);
  const user = await User.create({ ...payload, password });
  return user;
};

export const loginUser = async (phone, password) => {
  const user = await User.findOne({ phone });
  if (!user) throw new Error("Invalid credentials");

  const ok = await comparePassword(password, user.password);
  if (!ok) throw new Error("Invalid credentials");

  return user;
};