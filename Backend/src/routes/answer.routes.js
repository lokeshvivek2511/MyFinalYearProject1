import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  postAnswer,
  getAnswersByQuestion
} from "../controllers/answer.controller.js";
import { voteAnswer } from "../services/reputation.service.js";
const router = express.Router();

router.post("/", authMiddleware, postAnswer);
router.get("/:questionId", getAnswersByQuestion);
router.post(
  "/:answerId/vote",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { voteType } = req.body; // "up" or "down"
      const vote = await voteAnswer(
        req.params.answerId,
        req.user.id,
        voteType
      );

      res.json({
        message: "Vote recorded",
        vote
      });
    } catch (err) {
      next(err);
    }
  }
);
export default router;