// Backend/src/controllers/user.controller.js

import User from "../models/User.model.js";

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated",
      user: updated
    });
  } catch (err) {
    next(err);
  }
};