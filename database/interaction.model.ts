import { model, models, Schema, Types } from 'mongoose';
import { VoteTarget } from '@/database/vote.model';

export const Action = ['upvote', 'downvote', 'view', 'new-question'] as const;
export type ActionType = (typeof Action)[number];

export interface IInteraction {
  user: Types.ObjectId;
  action: ActionType;
  actionId: Types.ObjectId;
  actionAppliedTo: String;
}

const InteractionSchema = new Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, required: true },
    action: { type: String, required: true, enum: Action },
    actionId: { type: Schema.Types.ObjectId, required: true },
    actionAppliedTo: { type: String, required: true, enum: VoteTarget },
  },
  { timestamps: true }
);

const Interaction = models?.Interaction || model<IInteraction>('Interaction', InteractionSchema);

export default Interaction;
