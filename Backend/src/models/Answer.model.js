import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true
    },

    answerText: {
      type: String,
      required: true
    },

    answeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    isExpertAnswer: {
      type: Boolean,
      default: false
    },

    isAccepted: {
      type: Boolean,
      default: false
    },

    upvotes: {
      type: Number,
      default: 0
    },

    downvotes: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Answer = mongoose.model("Answer", answerSchema);
export default Answer;