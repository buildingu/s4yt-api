import { Types } from 'mongoose';

export interface AcceptedReferral {
  invited_user: { type: Types.ObjectId, ref: 'User' };
  coins: number;
}