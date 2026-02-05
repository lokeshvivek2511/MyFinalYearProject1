import { createUser, loginUser, generateToken } from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    const token = generateToken(user);

    res.status(201).json({
      message: "Registered successfully",
      token,
      user
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    const user = await loginUser(phone, password);
    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user
    });
  } catch (err) {
    next(err);
  }
};