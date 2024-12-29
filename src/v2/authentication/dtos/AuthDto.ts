import { Request } from 'express';
import User from '../../typings/User';

export interface GetUserRequestDto extends Request {
  params: {
    email: string;
  }
}

export interface RegisterRequestDto extends Request {
  body: {
    name: string;
    email: string;
    password: string;
    education: string;
    school: string;
    country: string;
    region: string;
    city: string;
  }
}

export interface LoginRequestDto extends Request {
  body: {
    email: string;
    password: string;
  }
}

export interface EmailVerificationRequestDto extends Request {
  query: {
    token: string;
  }
}

export interface UpdatePasswordRequestDto extends Request {
  body: {
    userId: string;
    oldPassword: string;
    newPassword: string;
  }
}

export interface ResetPasswordRequestDto extends Request {
  body: {
    token: string;
    newPassword: string;
  }
}