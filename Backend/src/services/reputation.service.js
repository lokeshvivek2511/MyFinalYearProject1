import Vote from "../models/Vote.model.js";
import Answer from "../models/Answer.model.js";
import User from "../models/User.model.js";

export const voteAnswer = async (answerId, userId, voteType) => {
  const vote = await Vote.create({
    answerId,
    userId,
    voteType
  });

  const inc =
    voteType === "up"
      ? { upvotes: 1 }
      : { downvotes: 1 };

  const answer = await Answer.findByIdAndUpdate(
    answerId,
    { $inc: inc },
    { new: true }
  );

  const reputationChange = voteType === "up" ? 5 : -2;

  await User.findByIdAndUpdate(answer.answeredBy, {
    $inc: { reputation: reputationChange }
  });

  return vote;
};