import { Types } from 'mongoose';

export interface MultipleChoice {
  business_id: Types.ObjectId;
  chest_id: Types.ObjectId;
  question: string;
  answers: {
    choices: Record<string, string>;
    correct: string;
    explanation: string;
  }
}