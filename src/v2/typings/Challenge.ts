import { Types } from 'mongoose';

export interface Challenge {
  title: string;
  description: string;
  business: Types.ObjectId;
  deleted: boolean;
}