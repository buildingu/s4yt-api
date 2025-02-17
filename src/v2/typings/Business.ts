import { Types } from 'mongoose';

export interface Business {
  name: string;
  admin_business_id: string;
  logo_s4yt?: string;
  logo_normal?: string;
  description?: string;
  attend_meeting: boolean;
  attachment?: string;
  video_url?: string;
  video_title?: string;
  challenge: Types.ObjectId;
  chests: Types.ObjectId[];
  winners: [
    {
      winnerId: string;
      award: number;
    }
  ],
  award: number;
  awardedTotal: number;
  deleted: boolean;
}

export interface BusinessInfo {
  name: string;
  logoS4yt: string;
  description: string;
}