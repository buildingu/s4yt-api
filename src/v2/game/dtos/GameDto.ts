import { Request } from 'express';
import { UpdateStakedCoins } from '../../typings/RaffleItem';

export interface SaveAnswerRequestDto extends Request {
  body: {
    challenge_id: string;
    submission_link: string;
  }
}

export interface RSVPMeetUpRequestDto extends Request {
  body: {
    attend_meeting: boolean;
  }
}

export interface AddChestCoinsRequestDto extends Request {
  body: {
    chest_id: string;
    amount: string;
  }
}

export interface UpdateStakedCoinsDto extends Request {
  body: {
    staked_items: [
      UpdateStakedCoins
    ],
    total_coins: number
  }
}