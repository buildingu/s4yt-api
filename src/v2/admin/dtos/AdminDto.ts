import { Request } from 'express';
import { BusinessInfo } from '../../typings/Business';

export interface CreateBusinessRequestDto extends Request {
  body: BusinessInfo;
}

export interface CreateChestRequestDto extends Request {
  body: any;
}