import { Request } from 'express';

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