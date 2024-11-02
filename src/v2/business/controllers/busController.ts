import { Request, Response } from 'express';
import * as businessService from '../services/busService';

export const updateBusinessInfo = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const businessInfo = req.body;
    const updatedBusiness = await businessService.updateBusinessInfo(businessId, businessInfo);
    res.json(updatedBusiness);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addQuestion = async (req: Request, res: Response) => {
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

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const questions = await businessService.getBusinessQuestions(businessId);
    res.json(questions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnswers = async (req: Request, res: Response) => {
  try {
    console.log('test');

    const { questionId } = req.params;
    const answers = await businessService.getAnswersToQuestion(questionId);
    res.json(answers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};