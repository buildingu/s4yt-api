import { Types } from 'mongoose';

export interface Business {
  admin_business_id: Types.ObjectId;
  name: string;
  logo?: string;
  link?: string;
  description?: string;
  video_url?: string;
  video_title?: string;
  challenge_question: Types.ObjectId;
  winners: [
    {
      user_id: Types.ObjectId;
      award: number;
    }
  ],
  award_limit: number;
  awarded_total: number;
  deleted: boolean;
}

export interface BusinessInfoBasic {
  name: string;
  logoS4yt: string;
  description: string;
}