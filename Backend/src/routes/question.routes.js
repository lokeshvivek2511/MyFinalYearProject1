import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  askQuestion,
  getQuestions
} from "../controllers/question.controller.js";

const router = express.Router();

router.post("/", authMiddleware, askQuestion);
router.get("/", getQuestions);

export default router;