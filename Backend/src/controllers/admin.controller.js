import User from "../models/User.model.js";
import { config } from "../config/env.js";

export const adminLogin = (req, res) => {
  const { password } = req.body;

  if (password !== config.ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid admin password" });
  }

  res.json({ message: "Admin logged in successfully" });
};

export const approveExpert = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { role: "expert", isExpertApproved: true },
      { new: true }
    );

    res.json({
      message: "Expert approved",
      user
    });
  } catch (err) {
    next(err);
  }
};