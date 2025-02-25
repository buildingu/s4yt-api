import { Schema } from 'mongoose';
import { CoinTransaction } from '../typings/CoinTransaction';

export const coinTransactionSchema = new Schema<CoinTransaction>({
  source: { type: String, required: true },
  count: { type: Number, required: true }
}, { _id : false });