import { Schema, model } from 'mongoose';
import { AcceptedReferral } from '../typings/AcceptedReferral';

export const acceptedReferralSchema = new Schema<AcceptedReferral>({
  invited_user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  coins: { type: Number, required: true }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: false
  }
});

export const AcceptedReferralModel = model('AcceptedReferral', acceptedReferralSchema);