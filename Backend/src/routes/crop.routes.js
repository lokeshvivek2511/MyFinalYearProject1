import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { recommendCrop } from "../controllers/crop.controller.js";

const router = express.Router();

router.post("/recommend", authMiddleware, recommendCrop);

export default router;