import { model, models, Schema, Types } from 'mongoose';

export interface IAnswer {
  questionId: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  meta: {
    upvotes: number;
    downvotes: number;
  };
}

export interface IAnswerDocument extends IAnswer, Document {}

const AnswerSchema = new Schema<IAnswer>(
  {
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    meta: {
      upvotes: { type: Number, default: 0 },
      downvotes: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Answer = models?.answer || model<IAnswer>('Answer', AnswerSchema);

export default Answer;
