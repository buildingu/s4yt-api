import { Types } from 'mongoose';

export interface Chest {
  chest_id: string;
  business: Types.ObjectId;
  group: Types.ObjectId[];
  deleted: boolean;
}