import { Request, Response, NextFunction } from "express";
import {
  RegisterRequestDto,
  LoginRequestDto,
  EmailVerificationRequestDto,
  UpdatePasswordRequestDto,
  GetUserRequestDto,
  ResetPasswordRequestDto,
  ResendVerificationEmailRequestDto,
  UpdateProfileRequestDto,
} from "../dtos/AuthDto";
import { CustomJwtPayload } from "../../typings/express/Request";

import * as authService from "../services/authService";
import { HttpError } from "../../middleware/errorHandler";

export const csrf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const csrfToken = await authService.csrf();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.json({ csrfToken });
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
    await authService.register(req.body);
    return res.status(201).json({
      message:
        "User was successfully registered. Verification email was sent successfully.",
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
    const token = req.body.token;
    const newVerification = await authService.verifyEmail(token as string);
    return res.status(200).json({
      message: newVerification 
        ? "Email was successfully verified."
        : "Email was already verified. You can log into your account."
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
      message: "Verification email was sent successfully.",
    });
  } catch (error: any) {
    next(error);
  }
};

export const login = async (
  req: LoginRequestDto,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const { user, coins, timestamps, jwtToken, csrfToken } = await authService.login({
      email,
      password
    });

    res.setHeader("Authorization", "Bearer " + jwtToken);
    res.setHeader("x-xsrf-token", csrfToken);
    // TODO: We should probably think about a logout route to clear things, like this cookie.
    res.cookie("XSRF-TOKEN", csrfToken, {
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year because this should last forever or however long the game lasts.
      httpOnly: true,
      secure: true,
      sameSite: "none" // TODO: I think we can try sameSite strict since the server and the client is on the same domain (s4yt.org)?
    });

    return res.status(200).json({
      message: "User is successfully authenticated.",
      user,
      coins,
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
    const userId =
      (req.decodedClaims as CustomJwtPayload)?.userId;
    const { old_password, password, password_confirmation } = req.body;
    await authService.updatePassword(userId, old_password, password, password_confirmation);
    res
      .status(200)
      .json({ message: "Password updated successfully. Please log in again." });
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
    res.status(200).json({
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
    const { token, password, password_confirmation } = req.body;
    await authService.resetPassword(token, password, password_confirmation);
    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: UpdateProfileRequestDto,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.decodedClaims as CustomJwtPayload)?.userId;
    const profileUpdates = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User identifier is missing." });
    }

    const [updatedUser, needsReverification] = await authService.updateProfile(
      userId,
      profileUpdates
    );

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
      verify_email: needsReverification,
    });
  } catch (error: any) {
    next(error);
  }
};

export const sendAcceptedReferrals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.decodedClaims as CustomJwtPayload)?.userId;
    if (!userId) {
      throw new HttpError('User is not authenticated', 401);
    }

    const acceptedReferrals = await authService.getAcceptedReferrals(userId);
    return res.status(200).json({ 
      message: "Referrals retrieved successfully.",
      referrals: acceptedReferrals
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
