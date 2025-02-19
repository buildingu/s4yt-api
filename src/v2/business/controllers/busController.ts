import { Request, Response } from 'express';
import * as businessService from '../services/busService';
import { AddChallengeRequestDto, GetAnswersRequestDto, GetChallengesRequestDto, UpdateBusinessRequestDto, AwardRequestDto, SelectWinnersRequestDto, GetEventResultsRequestDto, GetAwardRequestDto } from '../dtos/BusinessDto';

export const updateBusinessInfo = async (req: UpdateBusinessRequestDto, res: Response) => {
  try {
    const { businessId } = req.params;
    const businessInfo = req.body;
    const updatedBusiness = await businessService.updateBusinessInfo(businessId, businessInfo);
    res.json(updatedBusiness);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addChallenge = async (req: AddChallengeRequestDto, res: Response) => {
  try {
    const { businessId } = req.params;
    const challengeData = req.body;
    const updatedBusiness = await businessService.addChallengeToBusiness(businessId, challengeData);
    res.status(201).json(updatedBusiness);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateChallenge = async (req: Request, res: Response) => {
  try {
    const { challengeId } = req.params;
    const updateData = req.body;
    const updatedChallenge = await businessService.updateBusinessChallenge(challengeId, updateData);
    res.json(updatedChallenge);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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



export const updateAward = async (req: AwardRequestDto, res: Response) => {
  try {
    const { businessId } = req.params;
    const { award } = req.body;

    const updatedBusiness = await businessService.updateAwardAmount(businessId, award);
    res.json(updatedBusiness);
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


export const selectWinners = async (req: SelectWinnersRequestDto, res: Response) => {
  try {
    const { businessId } = req.params;
    const { winners } = req.body;

    const updatedWinners = await businessService.selectWinners(businessId, winners);
    res.json(updatedWinners);
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