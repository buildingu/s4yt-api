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
  }],
  winners: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

/*
  item_id
  raffle_partner - this needs to be populated
  name
  description
  image_src
  stock
  entries - see if the current user is among the entries in the array, if so, send back the number of coin they staked, otherwise, send the number 0 back
  isSilver - if entries is empty, then this is "true", otherwise it's "false"
*/

const RaffleItemModel = model<RaffleItem>('RaffleItem', raffleItemSchema);

export default RaffleItemModel;