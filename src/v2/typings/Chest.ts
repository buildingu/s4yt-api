import { Types } from 'mongoose';

export interface Chest {
  business_id: Types.ObjectId;
  chest_id: string;
  group: Types.ObjectId[];
  deleted: boolean;
}