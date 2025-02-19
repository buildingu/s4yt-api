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
    password_confirmation: string;
    referral_code: string;
    education: string;
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
  body: {
    token: string;
  }
}

export interface ResendVerificationEmailRequestDto extends Request {
  body: {
    email: string;
  }
}

export interface UpdatePasswordRequestDto extends Request {
  body: {
    old_password: string;
    password: string;
    password_confirmation: string;
  }
}

export interface ResetPasswordRequestDto extends Request {
  body: {
    token: string;
    old_password: string;
    password: string;
    password_confirmation: string;
  }
}