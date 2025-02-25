import { Request } from 'express';

export interface GetChallengesRequestDto extends Request {
  params: {
    businessId: string;
  }
}

export interface GetAnswersRequestDto extends Request {
  params: {
    challengeId: string;
  }
}

export interface GetAwardRequestDto extends Request {
  params: { businessId: string };
}

export interface GetEventResultsRequestDto extends Request {
  params: { businessId: string };
}
