import mongoose, { Document, Schema } from 'mongoose';

interface IRaffleWinner extends Document {
  raffle_item: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

const raffleWinnerSchema = new Schema<IRaffleWinner>({
  raffle_item: { type: Schema.Types.ObjectId, ref: 'RaffleItem' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

export const RaffleWinnerModel = mongoose.model<IRaffleWinner>('RaffleWinner', raffleWinnerSchema);
