import { Request } from 'express';
import { BusinessInfo } from '../../typings/Business';

export interface CreateBusinessRequestDto extends Request {
  body: BusinessInfo;
}

export interface CreateChestRequestDto extends Request {
  body: any;
}

export interface LoginResponse {
  token: string;
  userData: {
    _id: string;
    email: string;
    role: string;
    businessId?: string | null;
  };
}