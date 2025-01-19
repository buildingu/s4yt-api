import { Request } from 'express';
import User from '../../typings/User';

export interface GetUserRequestDto extends Request {
  params: {
    email: string;
  }
}
/**
 * There is also be password_confirmation coming, just check if the password and password_confirmation equals.
 */
export interface RegisterRequestDto extends Request {
  body: {
    name: string;
    email: string;
    password: string;
    // Don't add password_confirmation to the user, u know.
    password_confirmation: string;
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
  query: {
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