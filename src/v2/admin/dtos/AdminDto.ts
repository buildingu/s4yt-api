import { Request } from 'express';
import { BusinessInfoBasic } from '../../typings/Business';

export interface CreateBusinessRequestDto extends Request {
  body: BusinessInfoBasic;
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