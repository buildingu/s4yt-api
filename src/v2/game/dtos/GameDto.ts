import { Request } from 'express';
import { UpdateStakedCoins } from '../../typings/RaffleItem';

export interface SaveAnswerRequestDto extends Request {
  body: {
    userId: string;
    text: string;
  },
  params: {
    challengeId: string;
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

export interface UpdateStakedCoinsDto extends Request {
  body: {
    raffle: [
      UpdateStakedCoins
    ]
  }
}