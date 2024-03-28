import { Request, Response, NextFunction } from "express";
import * as gameService from "../services/gameService";

export const addSponsor = async (req: Request, res: Response) => {
  try {
    const sponsorData = req.body;
    const sponsor = await gameService.createSponsor(sponsorData);
    res.status(201).json(sponsor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSponsorInfo = async (req: Request, res: Response) => {
  try {
    const sponsorData = req.body;
    const sponsor = await gameService.updateSponsor(req.params.id, sponsorData);
    res.json(sponsor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSponsors = async (req: Request, res: Response) => {
  try {
    const sponsors = await gameService.getAllSponsors();
    res.json(sponsors);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to send raffle items info
export const sendRaffleInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const raffleItems = await gameService.getRaffleItemsService();
    res.json(raffleItems);
  } catch (error: any) {
    next(error);
  }
};

// Controller to send raffle coin indicators
export const sendRaffleIndicatorCoins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const indicators = await gameService.getRaffleIndicatorCoinsService();
    res.json(indicators);
  } catch (error: any) {
    next(error);
  }
};

// Controller to send raffle winners
export const sendRaffleWinners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const winners = await gameService.getRaffleWinnersService();
    res.json(winners);
  } catch (error: any) {
    next(error);
  }
};

// Controller to add quiz coins to a user's total
export const addQuizCoins = async (req: Request, res: Response, next: NextFunction) => {
  // Assuming we receive userId and coinCount from the request
  const { userId, coinCount } = req.body;
  try {
    const updatedUser = await gameService.assignCoinsToUser(userId, coinCount);
    res.status(200).json(updatedUser);
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
