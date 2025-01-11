import { Request, Response, NextFunction } from "express";
import * as gameService from "../services/gameService";
import { getInstructionsForUser } from "../services/gameService";
import mongoose from "mongoose";
import { SaveAnswerRequestDto, UpdateAnswerRequestDto } from "../dtos/GameDto";

export const addSponsor = async (req: Request, res: Response) => {
  try {
    const sponsorData = req.body;
    const sponsor = await gameService.createSponsor(sponsorData);
    res.status(201).json(sponsor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addPartner = async (req: Request, res: Response) => {
  try{
    const rafflePartnerData = req.body;
    const partner = await gameService.createRafflePartner(rafflePartnerData);
    res.status(201).json(partner);
  }catch(error: any){
    res.status(500).json({ message: error.message });
  }
};

export const updatePartner = async (req: Request, res: Response) => {
  try {
    const id = req.params.id; 
    const updatedData = req.body; 
    const updatedPartner = await gameService.editRafflePartner(id, updatedData);
    
    if (!updatedPartner) {
      return res.status(404).json({ message: 'Raffle partner not found' });
    }

    res.status(200).json(updatedPartner); 
  } catch (error: any) {
    res.status(500).json({ message: error.message }); 
  }
};

export const getRafflePartners = async (req: Request, res: Response) => {
  try {
    const partners = await gameService.getAllRafflePartners(); 
    res.status(200).json(partners); 
  } catch (error: any) {
    res.status(500).json({ message: error.message }); 
  }
};

export const getRafflePartner = async (req: Request, res: Response) => {
  try {
    const id = req.params.id; 
    const partner = await gameService.getRafflePartner(id);
    if (!partner) {
      return res.status(404).json({ message: 'Raffle partner not found' });
    }
    res.status(200).json(partner); 
  } catch (error: any) {
    res.status(500).json({ message: error.message }); 
  }
};

export const addMultipleChoice = async (req: Request, res: Response) => {
  try {
    const { sponsorId } = req.params;
    const multipleChoiceData = req.body;
    const multipleChoice = await gameService.addMultipleChoiceToSponsor(sponsorId, multipleChoiceData);
    res.status(201).json(multipleChoice);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

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

export const getMultipleChoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {sponsorId} = req.params;
    const sponsorMultipleChoice = await gameService.getMultipleChoiceFromSponsor(sponsorId);
    res.json(sponsorMultipleChoice);
  } catch (error: any) {
    next(error);
  }
}

export const submitSponsorQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {userId, multipleChoiceResponses} = req.body;
    const {sponsorId} = req.params;
    const submissions = await gameService.gradeSponsorQuiz(userId, sponsorId, multipleChoiceResponses);
    res.status(200).json(submissions);
  } catch (error: any) {
    next(error);
  }
}

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
    return res.status(200).json({ message: "" });
  } catch (error: any) {
    next(error);
  }
};

export const sendInstructions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.decodedClaims?.userId;
    if (!userId) {
      return res.status(401).json({ message: "User is not authenticated" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const instructionsData = await getInstructionsForUser(userObjectId);
    res.status(200).json(instructionsData);
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