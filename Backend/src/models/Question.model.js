import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    tags: [
      {
        type: String
      }
    ],

    askedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    answersCount: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["open", "answered", "closed"],
      default: "open"
    }
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);
export default Question;