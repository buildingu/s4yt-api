import { model, Schema } from 'mongoose';
import { RaffleItem } from '../typings/RaffleItem';
import { randomUUID } from 'crypto';

const raffleItemSchema = new Schema<RaffleItem>({
  item_id: { type: String, default: () => randomUUID() },
  raffle_partner: { type: Schema.Types.ObjectId, ref: 'RafflePartner'},
  name: { type: String, required: true },
  description: { type: String },
  image_src: { type: String, required: true },
  stock: { type: Number, required: true },
  entries: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    coins: { type: Number, required: true }
  }]
});

const RaffleItemModel = model<RaffleItem>('RaffleItem', raffleItemSchema);

export default RaffleItemModel;