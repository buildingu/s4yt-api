import { Request, Response, NextFunction } from "express";

import * as gameService from "../services/gameService";

export const sendSponsorsInfo = async (
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
  addQuizCoins = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ message: "" });
    } catch (error: any) {
      next(error);
    }
  };

export const sendBusinessesInfo = async (
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
  addMeetUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ message: "" });
    } catch (error: any) {
      next(error);
    }
  },
  sendBusinessChallengeWinners = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      return res.status(200).json({ message: "" });
    } catch (error: any) {
      next(error);
    }
  };

export const sendRaffleInfo = async (
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
  sendRaffleIndicatorCoins = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      return res.status(200).json({ message: "" });
    } catch (error: any) {
      next(error);
    }
  };

export const sendRaffleWinners = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(200).json({ message: "" });
  } catch (error: any) {
    next(error);
  }
};

export const sendCoinsGainedHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(200).json({ message: "" });
  } catch (error: any) {
    next(error);
  }
};
