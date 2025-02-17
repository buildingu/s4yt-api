import { Request } from 'express';

export interface SaveAnswerRequestDto extends Request {
  body: {
    userId: string;
    text: string;
  },
  params: {
    questionId: string;
  }
}

export interface UpdateAnswerRequestDto extends Request {
  body: {
    text: string;
  },
  params: {
    answerId: string;
  }
}

export interface AddChestCoinsRequestDto extends Request {
  body: {
    chestId: string;
    amount: string;
  }
}