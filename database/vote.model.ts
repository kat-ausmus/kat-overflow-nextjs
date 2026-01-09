import { model, models, Schema, Types } from "mongoose";

const VoteTarget = ["question", "answer"] as const;

export type VoteTargetType = (typeof VoteTarget)[number];
export type VoteType = "upvote" | "downvote";
export interface IVote {
  voter: Types.ObjectId;
  targetId: Types.ObjectId;
  targetType: VoteTargetType;
  type: VoteType;
  votedAt: Date;
}

const VoteSchema = new Schema<IVote>(
  {
    voter: { type: Schema.Types.ObjectId, required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    targetType: { type: String, enum: VoteTarget, required: true },
    type: { type: String, required: true },
    votedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const Vote = models?.Vote || model<IVote>("Vote", VoteSchema);

export default Vote;
