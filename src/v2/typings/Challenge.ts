import { Types } from 'mongoose';

export interface Challenge {
  _id: Types.ObjectId;
  title: string;
  description: string;
  business: Types.ObjectId;
  deleted: boolean;
}