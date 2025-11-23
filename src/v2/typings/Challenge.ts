import { Types } from 'mongoose';
import { userEducation } from './User';

export interface Challenge {
  _id: Types.ObjectId;
  title: string;
  description: string;
  business: Types.ObjectId;
  deleted: boolean;
}

export interface BusinessChallengeWinners {
  business_name?: string;
  logo?: string;
  winners: ChallengeWinner[];
}

export interface ChallengeWinner {
  award?: number;
  name?: string;
  education?: typeof userEducation[number] | null;
  region?: string | null;
  country?: string;
}