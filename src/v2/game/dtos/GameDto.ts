import { Request } from 'express';

export interface SaveAnswerRequestDto extends Request {
  body: {
    challengeId: string;
    submissionLink: string;
  }
}

export interface AddChestCoinsRequestDto extends Request {
  body: {
    chestId: string;
    amount: string;
  }
}