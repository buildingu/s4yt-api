import { Request, Response, NextFunction } from "express";
import * as gameService from "../services/gameService";
import mongoose from "mongoose";
import { AddChestCoinsRequestDto, SaveAnswerRequestDto, UpdateAnswerRequestDto } from "../dtos/GameDto";
import { CustomJwtPayload } from "../../typings/express/Request";
import { HttpError } from "../../middleware/errorHandler";

export const addPartner = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const rafflePartnerData = req.body;
    const partner = await gameService.createRafflePartner(rafflePartnerData);
    res.json(partner);
  }catch(error: any){
   next(error);
  }
};

export const updatePartner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id; 
    const updatedData = req.body; 
    const updatedPartner = await gameService.editRafflePartner(id, updatedData);
    res.json(updatedPartner); 
  } catch (error: any) {
    next(error); 
  }
};

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

// Controller to add "Learn and Earn" chest coins to a user's total
export const addChestCoins = async (req: AddChestCoinsRequestDto, res: Response, next: NextFunction) => {
  try {
    const userId = (req.decodedClaims as CustomJwtPayload)?.userId;
    if (!userId) {
      throw new HttpError('User is not authenticated', 401);
    }
  
    // TODO: You also need to make a route to give me all the questions (chests), you can just put all the mock data I had on the front in to documents and just give me that for the time being.
    // Also, use a uuid for the chest_id, it's nice in mongoose because you can just do default: crypto.RandomUUID() or whatever it's called.
    const { amount, chestId } = req.body;
    const user = await gameService.assignCoinsToUser(userId, parseInt(amount), 'chest', { chestId });

    res.status(200).json({ chests_submitted: user.chests_submitted });
  } catch (error: any) {
    next(error);
  }
};

export const sendBusinessesInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allBusinesses = await gameService.sendBusinessesInfo();
    res.json(allBusinesses);
  } catch (error: any) {
    next(error);
  }
};

export const saveAnswer = async (req: SaveAnswerRequestDto, res: Response) => {
  try {
    const { questionId } = req.params;
    const { userId, text, submit } = req.body;
    const boolSubmit = submit === 'true';

    const answer = await gameService.saveAnswer(questionId, userId, text, boolSubmit);
    res.status(200).json(answer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAnswer = async (req: UpdateAnswerRequestDto, res: Response) => {
  try {
    const { answerId } = req.params;
    const { text, submit } = req.body;
    const boolSubmit = submit === 'true';

    const answer = await gameService.updateAnswer(answerId, text, boolSubmit);
    res.json(answer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addMeetUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
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

export const getTreasureMap = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.decodedClaims?.userId;
    if (!userId) {
      return res.status(401).json({ message: "User is not authenticated." });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    const treasureMapData = await gameService.getTreasureMapData(userObjectId);
    res.json(treasureMapData);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({ message: "Invalid user ID format." });
    } else {
      next(error);
    }
  }
};