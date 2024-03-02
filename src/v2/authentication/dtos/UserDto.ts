export interface RegisterDto {
  email: string;
  password: string;
  username: string;
}

export interface LoginDto {
  email: string;
  password: string;
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