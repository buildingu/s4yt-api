import { Schema, Types, model } from 'mongoose';
import { Chest } from '../typings/Chest';
import { randomUUID } from 'crypto';

const chestSchema = new Schema<Chest>({
  business_id: { type: Schema.Types.ObjectId, ref: 'Business' },
  chest_id: { type: String, default: () => randomUUID()},
  group: [{ type: Types.ObjectId, ref: 'MultipleChoice' }],
  deleted: { type: Boolean, default: false }
});

const ChestModel = model('Chest', chestSchema);

export default ChestModel;
