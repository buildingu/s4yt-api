import { Schema, Document, model } from 'mongoose';
import { CoinTransaction } from '../typings/CoinTransaction';

export const coinTransactionSchema = new Schema<CoinTransaction & Document>({
  source: { type: String, required: true },
  count: { type: Number, required: true }
}, { _id : false });

export const CoinTransactionModel = model<CoinTransaction & Document>('CoinTransaction', coinTransactionSchema);