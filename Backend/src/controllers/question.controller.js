import Question from "../models/Question.model.js";
import User from "../models/User.model.js";

export const askQuestion = async (req, res, next) => {
  try {
    const { title, description, tags } = req.body;

    const question = await Question.create({
      title,
      description,
      tags,
      askedBy: req.user.id
    });

    await User.findByIdAndUpdate(req.user.id, {
      $inc: { questionsAsked: 1 }
    });

    res.status(201).json({
      message: "Question posted successfully",
      question
    });
  } catch (err) {
    next(err);
  }
};

export const getQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find()
      .populate("askedBy", "name reputation role")
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (err) {
    next(err);
  }
};