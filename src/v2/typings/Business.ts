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

export interface BusinessInfo {
  name: string;
  logo: string;
  link: string;
  description: string;
  challenge_question: {
    title: string;
    description: string;
    answers_count: number;
    answer_submitted: boolean;
  };
  video_url: string;
  video_title: string;
}