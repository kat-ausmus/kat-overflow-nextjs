import { model, models, Schema, Types } from "mongoose";

export interface ITag {
  name: string;
  author?: Types.ObjectId;
  questionUsage: number;
}

const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    questionUsage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Tag = models?.Tag || model<ITag>("Tag", TagSchema);

export default Tag;
