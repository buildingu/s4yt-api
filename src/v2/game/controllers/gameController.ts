import { Request, Response, NextFunction } from "express";
import * as gameService from "../services/gameService";
import { AddChestCoinsRequestDto, RSVPMeetUpRequestDto, SaveAnswerRequestDto } from "../dtos/GameDto";
import { CustomJwtPayload } from "../../typings/express/Request";
import { HttpError } from "../../middleware/errorHandler";

export const getRafflePartners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const partners = await gameService.getAllRafflePartners(); 
    res.json(partners); 
  } catch (error: any) {
    next(error); 
  }
};

export const getRafflePartner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id; 
    const partner = await gameService.getRafflePartner(id);
    res.json(partner); 
  } catch (error: any) {
    next(error); 
  }
};

// Controller to send raffle items info
export const sendRaffleInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const raffleItems = await gameService.getRaffleItems();
    res.status(200).json(raffleItems);
  } catch (error: any) {
    next(error);
  }
};

// Controller to send raffle coin indicators
/*export const sendRaffleIndicatorCoins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const indicators = await gameService.getRaffleIndicatorCoinsService();
    res.json(indicators);
  } catch (error: any) {
    next(error);
  }
};*/

// Controller to send raffle winners
export const sendRaffleWinners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const winners = await gameService.getRaffleWinners();
    res.json(winners);
  } catch (error: any) {
    next(error);
  }
};

// Controller to add "Learn and Earn" chest coins to a user's total
export const addChestCoins = async (req: AddChestCoinsRequestDto, res: Response, next: NextFunction) => {
  try {
    const userId = (req.decodedClaims as CustomJwtPayload)?.userId;
    if (!userId) {
      throw new HttpError('User is not authenticated', 401);
    }
  
    const { amount, chestId } = req.body;
    const user = await gameService.assignCoinsToUser(userId, parseInt(amount), 'chest', { chestId });

    res.status(200).json({ chests_submitted: user.chests_submitted });
  } catch (error: any) {
    next(error);
  }
};

export const getChests = async (req: Request, res: Response, next: NextFunction) => {
  try { 
    const chests = await gameService.getChests();
    res.status(200).json(chests);
  } catch (error: any) {
    next(error);
  }
}

export const saveAnswer = async (req: SaveAnswerRequestDto, res: Response) => {
  try {
    const userId = (req.decodedClaims as CustomJwtPayload)?.userId;
    if (!userId) {
      throw new HttpError('User is not authenticated', 401);
    }
    const { challengeId, submissionLink } = req.body;

    await gameService.saveAnswer(challengeId, userId, submissionLink);
    res
      .status(200)
      .json({ message: "Answer submitted." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const rsvpMeetUp = async (req: RSVPMeetUpRequestDto, res: Response, next: NextFunction) => {
  try {
    const userId = (req.decodedClaims as CustomJwtPayload)?.userId;
    if (!userId) {
      throw new HttpError('User is not authenticated', 401);
    }
    const { attendMeeting } = req.body;

    await gameService.rsvpMeetUp(userId, attendMeeting);
    return res.status(200).json({ message: "RSVP status updated." });
  } catch (error: any) {
    next(error);
  }
};

export const sendBusinessChallengeWinners = async (
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

export const displayEventResults = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventResults = await gameService.getEventResults();
    res.status(200).json(eventResults);
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
    const userId = (req.decodedClaims as CustomJwtPayload)?.userId;
    if (!userId) {
      throw new HttpError('User is not authenticated', 401);
    }

    const coinHistory = await gameService.getCoinsGainedHistory(userId);
    return res.status(200).json({ coin_details: coinHistory });
  } catch (error: any) {
    next(error);
  }
};

export const sendCoinsTotal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.decodedClaims as CustomJwtPayload)?.userId;
    if (!userId) {
      throw new HttpError('User is not authenticated', 401);
    }

    const coinTotal = await gameService.getCoinsTotal(userId);
    return res.status(200).json(coinTotal);
  } catch (error: any) {
    next(error);
  }
};