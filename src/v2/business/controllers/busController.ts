import { Request, Response } from 'express';
import * as businessService from '../services/busService';
import { AddQuestionRequestDto, GetAnswersRequestDto, GetQuestionsRequestDto, UpdateBusinessRequestDto, AwardRequestDto, SelectWinnersRequestDto, GetEventResultsRequestDto, GetAwardRequestDto } from '../dtos/BusinessDto';

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

export const addQuestion = async (req: AddQuestionRequestDto, res: Response) => {
  try {
    const { businessId } = req.params;
    const questionData = req.body;
    const updatedBusiness = await businessService.addQuestionToBusiness(businessId, questionData);
    res.status(201).json(updatedBusiness);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const { questionId } = req.params;
    const updateData = req.body;
    const updatedQuestion = await businessService.updateBusinessQuestion(questionId, updateData);
    res.json(updatedQuestion);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuestions = async (req: GetQuestionsRequestDto, res: Response) => {
  try {
    const { businessId } = req.params;
    const questions = await businessService.getBusinessQuestions(businessId);
    res.json(questions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnswers = async (req: GetAnswersRequestDto, res: Response) => {
  try {
    const { questionId } = req.params;
    const answers = await businessService.getAnswersToQuestion(questionId);
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