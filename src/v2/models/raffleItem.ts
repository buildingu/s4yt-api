import { Document, model, Schema, Types } from 'mongoose';

interface Stake {
  user: Types.ObjectId;
  coin_staked: number;
}

interface IRaffleItem extends Document {
  name_raffleitem: string;
  image: string;
  qty: number;
  stake: Stake[];
}

const raffleItemSchema = new Schema<IRaffleItem>({
  name_raffleitem: { type: String, required: true },
  image: { type: String, required: true },
  qty: { type: Number, required: true },
  stake: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    coin_staked: { type: Number, required: true }
  }]
});

const RaffleItemModel = model<IRaffleItem>('RaffleItem', raffleItemSchema);

export default RaffleItemModel;