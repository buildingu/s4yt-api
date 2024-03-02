import { Request, Response, NextFunction,  } from "express";
import RegisterRequestDto from "../dtos/RegisterRequestDto";
import { CustomJwtPayload } from '../../typings/express/Request';

import * as authService from "../services/authService";
import * as jwtService from "../services/jwtService";

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
  req: Request,
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
      message: "User was successfully registered.",
      user: newUser,
    });
  } catch (error: any) {
    next(error);
  }
};

export const emailVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.query.token;
    await authService.verifyEmail(token as string);
    res.redirect("/login");
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login({ email, password });

    res.setHeader("Authorization", "Bearer " + token);

    return res.status(200).json({
      message: "User is successfully authenticated.",
      user,
      token, // testing purposes
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.decodedClaims as CustomJwtPayload)?.userId || req.body.userId;

    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is missing." });
    }

    await authService.updatePassword(userId, newPassword);

    res.status(200).json({ message: "Password updated successfully. Please log in again." });

    res.redirect("/logout");
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

// Reset the password
export const resetPassword = async (
  req: Request,
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

export const updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      return res.status(200).json({ message: "" });
    } catch (error: any) {
      next(error);
    }
  },
  sendReferrals = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ message: "" });
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
