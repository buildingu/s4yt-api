import { model, Schema } from 'mongoose';
import { RaffleItem } from '../typings/RaffleItem';
import { RafflePartnerModel } from './rafflePartner';
import { randomUUID } from 'crypto';

const raffleItemSchema = new Schema<RaffleItem>({
  item_id: { type: String, default: () => randomUUID() },
  raffle_partner: { type: Schema.Types.ObjectId, ref: RafflePartnerModel},
  name: { type: String, required: true },
  description: { type: String },
  image_src: { type: String, required: true },
  stock: { type: Number, required: true },
  entries: [{
    _id: false,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    coins: { type: Number, required: true }
    
  }],
  winners: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const RaffleItemModel = model<RaffleItem>('RaffleItem', raffleItemSchema);

export default RaffleItemModel;