import { Types } from 'mongoose';

export interface Business {
  name: string;
  business_id: string;
  logo_s4yt?: string;
  logo_normal?: string;
  description?: string;
  attend_meeting: boolean;
  attachment?: string;
  video_urls?: string[];
  questions: Types.ObjectId[];
  winners: [
    {
      winnerId: Types.ObjectId[];
      award: number;
    }
  ],
  award: number;
  awardedTotal: number;
  deleted: boolean
}

export interface BusinessInfo {
  name: string;
  logoS4yt: string;
  description: string;
}