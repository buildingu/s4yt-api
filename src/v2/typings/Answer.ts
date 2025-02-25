import { Types } from 'mongoose';

export interface Answer {
  user: Types.ObjectId;
  challenge_id: Types.ObjectId;
  rating?: number;
  submission_link?: string;
  timestamp?: Date;
  deleted: boolean;
}