import { Document, model, Schema, Types } from 'mongoose';

const raffleItemSchema = new Schema({
  name_raffleitem: { type: String, required: true },
  image: { type: String, required: true },
  qty: { type: Number, required: true },
  stake: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    coin_staked: { type: Number, required: true }
  }]
});

const RaffleItemModel = model('RaffleItem', raffleItemSchema);

export default RaffleItemModel;