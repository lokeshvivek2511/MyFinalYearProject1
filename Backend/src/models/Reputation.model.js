// Backend/src/models/Reputation.model.js

import mongoose from "mongoose";

const reputationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    change: {
      type: Number, // +5, -2, etc.
      required: true
    },

    reason: {
      type: String // upvote, downvote, accepted answer
    }
  },
  { timestamps: true }
);

const Reputation = mongoose.model("Reputation", reputationSchema);
export default Reputation;