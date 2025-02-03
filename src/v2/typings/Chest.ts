import { Types } from 'mongoose';

export interface Chest {
  chest_id: string;
  group: Types.ObjectId[];
}