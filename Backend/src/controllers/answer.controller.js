import Answer from "../models/Answer.model.js";
import Question from "../models/Question.model.js";
import User from "../models/User.model.js";

export const postAnswer = async (req, res, next) => {
  try {
    const { questionId, answerText } = req.body;

    const user = await User.findById(req.user.id);

    const answer = await Answer.create({
      questionId,
      answerText,
      answeredBy: req.user.id,
      isExpertAnswer: user.role === "expert" && user.isExpertApproved
    });

    await Question.findByIdAndUpdate(questionId, {
      $inc: { answersCount: 1 }
    });

    await User.findByIdAndUpdate(req.user.id, {
      $inc: { answersGiven: 1 }
    });

    res.status(201).json({
      message: "Answer posted successfully",
      answer
    });
  } catch (err) {
    next(err);
  }
};

export const getAnswersByQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;

    const answers = await Answer.find({ questionId })
      .populate("answeredBy", "name reputation role")
      .sort({
        isExpertAnswer: -1,
        upvotes: -1,
        createdAt: -1
      });

    res.json(answers);
  } catch (err) {
    next(err);
  }
};