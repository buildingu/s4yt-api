import { Request } from 'express';
import User from '../../typings/User';

export interface RegisterRequestDto extends Request {
  body: User;
}

export interface LoginRequestDto extends Request {
  body: {
    email: string;
    password: string;
  }
}

export interface EmailVerificationDto {
  token: string;
}

export interface ResetPasswordRequestDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
}