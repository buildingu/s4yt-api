import { Request } from 'express';
import { BusinessInfoBasic } from '../../typings/Business';

export interface UpdateBusinessRequestDto extends Request {
  body: BusinessInfoBasic;
  params: {
    businessId: string;
  }
}

export interface GetChallengesRequestDto extends Request {
  params: {
    businessId: string;
  }
}

export interface AddChallengeRequestDto extends Request {
  body: {
    text: string;
    description: string;
  },
  params: {
    businessId: string;
  }
}

export interface GetAnswersRequestDto extends Request {
  params: {
    challengeId: string;
  }
}

export interface AwardRequestDto extends Request {
  body: { award: number };
  params: { businessId: string };
}

export interface SelectWinnersRequestDto extends Request {
  body: {
    winners: { winnerId: string; award: number }[];
  };
  params: { businessId: string };
}

export interface GetAwardRequestDto extends Request {
  params: { businessId: string };
}

export interface GetEventResultsRequestDto extends Request {
  params: { businessId: string };
}
