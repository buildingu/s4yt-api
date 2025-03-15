import { Request, Response, NextFunction } from "express";
import * as businessService from '../services/busService';
import { GetAnswersRequestDto, GetChallengesRequestDto, GetEventResultsRequestDto, GetAwardRequestDto } from '../dtos/BusinessDto';

export const sendBusinessesInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allBusinesses = await businessService.sendBusinessesInfo();
    res.json(allBusinesses);
  } catch (error: any) {
    next(error);
  }
};

export const getChallenges = async (req: GetChallengesRequestDto, res: Response) => {
  try {
    const { businessId } = req.params;
    const challenges = await businessService.getBusinessChallenges(businessId);
    res.json(challenges);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnswers = async (req: GetAnswersRequestDto, res: Response) => {
  try {
    const { challengeId } = req.params;
    const answers = await businessService.getAnswersToChallenge(challengeId);
    res.status(200).json(answers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAwardDetails = async (req: GetAwardRequestDto, res: Response) => {
  try {
    const { businessId } = req.params;
    
    const awardDetails = await businessService.getAwardDetails(businessId);
    res.json(awardDetails);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventResults = async (req: GetEventResultsRequestDto, res: Response) => {
  try {
    const { businessId } = req.params;

    const results = await businessService.getEventResults(businessId);
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};