import { Request, Response, NextFunction,  } from "express";
import {
  RegisterRequestDto,
  LoginRequestDto,
  EmailVerificationRequestDto,
  UpdatePasswordRequestDto,
  GetUserRequestDto,
  ResetPasswordRequestDto,
  ResendVerificationEmailRequestDto
} from "../dtos/AuthDto";
import { CustomJwtPayload } from '../../typings/express/Request';

import * as authService from "../services/authService";

export const csrf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const csrfToken = await authService.csrf();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.json({ csrfToken });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await authService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: GetUserRequestDto,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.params.email;
    const user = await authService.getUser(email);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: RegisterRequestDto,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUser = await authService.register(req.body);
    return res.status(201).json({
      message: "User was successfully registered. Verification email was sent successfully."
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const emailVerify = async (
  req: EmailVerificationRequestDto,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.query.token;
    await authService.verifyEmail(token as string);
    return res.status(200).json({
      message: "Email was successfully verified."
    });
  } catch (error: any) {
    next(error);
  }
};

export const resendVerificationEmail = async (
  req: ResendVerificationEmailRequestDto,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.resendVerificationEmail(req.body.email);
    return res.status(200).json({
      message: "Verification email was sent successfully."
    });
  } catch (error: any) {
    next(error);
  }
}

export const login = async (
  req: LoginRequestDto,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const { user, timestamps, jwtToken, csrfToken } = await authService.login({ email, password });

    res.setHeader("Authorization", "Bearer " + jwtToken);
    res.setHeader("x-xsrf-token", csrfToken);
    res.cookie("XSRF-TOKEN", csrfToken);

    return res.status(200).json({
      message: "User is successfully authenticated.",
      user,
      timestamps
    });
  } catch (error: any) {
    next(error);
  }
};

export const updatePassword = async (
  req: UpdatePasswordRequestDto,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.decodedClaims as CustomJwtPayload)?.userId || req.body.userId;
    const { oldPassword, newPassword } = req.body;
    await authService.updatePassword(userId, oldPassword, newPassword);
    res.status(200).json({ message: "Password updated successfully. Please log in again." });

    //res.redirect("/logout");
  } catch (error: any) {
    next(error);
  }
};

export const sendResetPasswordEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    await authService.initiatePasswordReset(email);
    res
      .status(200)
      .json({
        message:
          "If a user with that email exists, a password reset email has been sent.",
      });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: ResetPasswordRequestDto,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.decodedClaims as CustomJwtPayload)?.userId;
    const profileUpdates = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User identifier is missing." });
    }

    const updatedUser = await authService.updateProfile(userId, profileUpdates);

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser
    });
  } catch (error: any) {
    next(error);
  }
};

export const sendReferrals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.decodedClaims as CustomJwtPayload)?.userId || req.body.userId; 
    const referrals = await authService.sendReferrals(userId);

    return res.status(200).json({
      message: "Referrals retrieved successfully.",
      referrals
    });
  } catch (error: any) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      message: "User has been successfully logged out.",
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;

    await authService.deleteUser(email);

    return res
      .status(200)
      .json({ message: `User with email ${email} was successfully deleted.` });
  } catch (error: any) {
    next(error);
  }
};
