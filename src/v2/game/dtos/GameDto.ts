import { Request } from 'express';

export interface SaveAnswerRequestDto extends Request {
  body: {
    userId: string;
    text: string;
    submit: string;
  },
  params: {
    questionId: string;
  }
}

export interface UpdateAnswerRequestDto extends Request {
  body: {
    text: string;
    submit: string;
  },
  params: {
    answerId: string;
  }
}

export interface AddChestCoinsRequestDto extends Request {
  body: {
    chestId: string;
    amount: string;
    foo: string[];
  }
}