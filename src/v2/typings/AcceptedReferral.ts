import { Types } from 'mongoose';

export interface AcceptedReferral {
  invited_user: Types.ObjectId;
  coins: number;
}