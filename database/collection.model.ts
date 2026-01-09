import { model, models, Schema } from 'mongoose';

export interface ICollection {}

const CollectionSchema = new Schema<ICollection>({}, { timestamps: true });

const Collection = models?.Collection || model<ICollection>('Collection', CollectionSchema);

export default Collection;
