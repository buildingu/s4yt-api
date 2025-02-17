import mongoose, { Schema, Types } from 'mongoose';
import { Chest } from '../typings/Chest';
import { randomUUID } from 'crypto';

const chestSchema = new Schema<Chest>({
  chest_id: { type: String, default: () => randomUUID()},
  business: { type: Schema.Types.ObjectId, ref: 'Business' },
  group: [{ type: Types.ObjectId, ref: 'MultipleChoice' }],
  deleted: { type: Boolean, default: false }
});

const ChestModel = mongoose.model('Chest', chestSchema);

export default ChestModel;
