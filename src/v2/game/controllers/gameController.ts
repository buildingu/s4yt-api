import { Request, Response, NextFunction } from "express";
import * as gameService from "../services/gameService";
import mongoose from "mongoose";
import {
  AddChestCoinsRequestDto,
  SaveAnswerRequestDto,
  UpdateAnswerRequestDto,
  UpdateStakedCoinsDto,
} from "../dtos/GameDto";
import { CustomJwtPayload } from "../../typings/express/Request";
import { HttpError } from "../../middleware/errorHandler";

export const getRafflePartners = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const partners = await gameService.getAllRafflePartners();
    res.json(partners);
  } catch (error: any) {
    next(error);
  }
};

export const getRaffleItemsTransformed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log(userId)
    const userId = (req.decodedClaims as CustomJwtPayload)?.userId;
    // console.log("userId", userId);
    const raffleItems = await gameService.getRaffleItemsTransformed(userId);
    res.json(raffleItems);
  } catch (error: any) {
    next(error);
  }
};

export const updateStakedCoins = async (req: UpdateStakedCoinsDto, res: Response, next: NextFunction) => {
  try {
    const { staked_items } = req.body;
    const userId = (req.decodedClaims as CustomJwtPayload)?.userId;
    const result = await gameService.updateStakedCoins(staked_items, userId);
    res.json(result);
  } catch (error: any) {
    next(error);
  }
}

export const selectRaffleWinners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await gameService.selectRaffleWinners();
    res.status(200).json({ message: "Raffle winners selected", "result": result });
  } catch (error: any) {
    next(error);
  }
}

export const getRafflePartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const partner = await gameService.getRafflePartner(id);
    res.json(partner);
  } catch (error: any) {
    next(error);
  }
};

// Controller to send raffle items info
export const sendRaffleInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
export const sendRaffleWinners = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const winners = await gameService.getRaffleWinners();
    res.json(winners);
  } catch (error: any) {
    next(error);
  }
};

// Controller to add "Learn and Earn" chest coins to a user's total
export const addChestCoins = async (
  req: AddChestCoinsRequestDto,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.decodedClaims as CustomJwtPayload)?.userId;
    if (!userId) {
      throw new HttpError("User is not authenticated", 401);
    }

    const { amount, chestId } = req.body;
    const user = await gameService.assignCoinsToUser(
      userId,
      parseInt(amount),
      "chest",
      { chestId }
    );

    res.status(200).json({ chests_submitted: user.chests_submitted });
  } catch (error: any) {
    next(error);
  }
};

export const getChests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chests = await gameService.getChests();
    res.status(200).json(chests);
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
    const allBusinesses = await gameService.sendBusinessesInfo();
    res.json(allBusinesses);
  } catch (error: any) {
    next(error);
  }
};

export const saveAnswer = async (req: SaveAnswerRequestDto, res: Response) => {
  try {
    const { challengeId } = req.params;
    const { userId, text } = req.body;

    const answer = await gameService.saveAnswer(challengeId, userId, text);
    res.status(200).json(answer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAnswer = async (
  req: UpdateAnswerRequestDto,
  res: Response
) => {
  try {
    const { answerId } = req.params;
    const { text } = req.body;

    const answer = await gameService.updateAnswer(answerId, text);
    res.json(answer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addMeetUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: There is only one meeting now
    const { businessId } = req.params;
    const { userId, rsvpType } = req.body;

    const addResult = await gameService.addMeetUp(businessId, userId, rsvpType);
    return res.status(200).json({ message: "Player added to meeting" });
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
      throw new HttpError("User is not authenticated", 401);
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
      throw new HttpError("User is not authenticated", 401);
    }

    const coinTotal = await gameService.getCoinsTotal(userId);
    return res.status(200).json(coinTotal);
  } catch (error: any) {
    next(error);
  }
};
