import { Types } from 'mongoose';

export interface Business {
  name: string;
  business_user_id: Types.ObjectId;
  admin_business_id: string;
  logo?: string;
  description?: string;
  video_url?: string;
  video_title?: string;
  challenge_question: Types.ObjectId;
  chests: Types.ObjectId[];
  winners: [
    {
      winner_id: string;
      award: number;
    }
  ],
  award: number;
  awarded_total: number;
  deleted: boolean;
}

export interface BusinessInfoBasic {
  name: string;
  logoS4yt: string;
  description: string;
}