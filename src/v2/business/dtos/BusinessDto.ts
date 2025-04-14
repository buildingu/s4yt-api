import { Request } from 'express';

export interface GetAwardRequestDto extends Request {
  params: { businessId: string };
}

export interface GetEventResultsRequestDto extends Request {
  params: { businessId: string };
}