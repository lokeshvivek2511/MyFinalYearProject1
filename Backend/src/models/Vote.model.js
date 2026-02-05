import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    answerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    voteType: {
      type: String,
      enum: ["up", "down"],
      required: true
    }
  },
  { timestamps: true }
);

voteSchema.index({ answerId: 1, userId: 1 }, { unique: true });

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;