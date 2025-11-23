import { Types } from 'mongoose';

export interface ChestAnswerDTO {
  choices: {
    A: string;
    B: string;
    C: string;
  },
  correct: 'A' | 'B' | 'C',
  explanation: string;
}

export interface ChestDTO {
  answers: ChestAnswerDTO;
  question: string;
}

export interface BusinessChestsDTO {
  business_id: Types.ObjectId;
  group: ChestDTO[];
  deleted: boolean;
  chest_id: string;
}