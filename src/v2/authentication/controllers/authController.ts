import { Request, Response, NextFunction } from "express";
import RegisterRequestDto from "../dtos/RegisterRequestDto";

import * as authService from "../services/authService";
import * as jwtService from "../services/jwtService";

export const register = async (
    req: RegisterRequestDto,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await authService.getUser(req.body.email);
      if (user)
        return res.status(400).json({ message: "User already exists." });

      await authService.register(req.body);

      return res
        .status(200)
        .json({ message: "User was successfully registered." });
    } catch (error: any) {
      next(error);
    }
  },
  emailVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ message: "" });
    } catch (error: any) {
      next(error);
    }
  };

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.getUser(req.body.email);
    if (user) {
      return res.status(404).json({
        message: user,
      });
    }

    // You should make the token in the service?
    // const generateJWT = new jwtService.GenerateJWT(),
    //   accessToken = generateJWT.accessToken(user.email);

    // Put the token in the headers, we had it in the body last time, which i don't know if that safe is it?
    return res.status(200).json({
      message: "User is successfully authenticated.",
      user: user,
    });
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
      return res.status(200).json({ message: "" });
    } catch (error: any) {
      next(error);
    }
  },
  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ message: "" });
    } catch (error: any) {
      next(error);
    }
  },
  updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ message: "" });
    } catch (error: any) {
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
    // Clear their token or something.
    return res.status(200).json({ message: "User log out successful." });
  } catch (error: any) {
    error.reason = "failed to clear user session.";
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // await authService.deleteUser(req.params.email);

    return res
      .status(200)
      .json({ message: `User ${req.params.email} was successfully deleted.` });
  } catch (error) {
    next(error);
  }
};
