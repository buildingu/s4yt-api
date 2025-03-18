import { Request } from 'express';

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
    chestId: string;
    amount: string;
  }
}