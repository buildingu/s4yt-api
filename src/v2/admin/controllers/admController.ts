import { Request, Response } from 'express';
import * as superAdminService from '../services/admService';
import * as playerService from '../../business/services/playerService';

// export const uploadImage = async (req: Request, res: Response) => {
//   try {
//     const { image } = req.body; // Assuming image is in the request body
//     await playerService.uploadImage(image);
//     res.status(201).send('Image uploaded successfully');
//   } catch (error: any) {
//     res.status(500).send(error.message);
//   }
// };

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await superAdminService.retrieveAllUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const kickUser = async (req: Request, res: Response) => {
  try {
    await superAdminService.kickOutUser(req.params.userId);
    res.json({ message: 'User has been kicked out successfully.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const banUser = async (req: Request, res: Response) => {
  try {
    const { duration } = req.body;
    await superAdminService.banAUser(req.params.userId, duration);
    res.json({ message: 'User has been banned successfully.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createBusiness = async (req: Request, res: Response) => {
  try {
    const { name, logo, description } = req.body;
    await superAdminService.createBusiness(name, logo, description);
    res.status(200).send('Business created successfully');
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const getAllBusinesses = async (req: Request, res: Response) => {
  try {
    const businesses = await superAdminService.retrieveAllBusinesses();
    res.json(businesses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const editBusinessQuestion = async (req: Request, res: Response) => {
  try {
    const { questionId, questionData } = req.body;
    await superAdminService.editQuestion(questionId, questionData);
    res.status(200).send('Question edited successfully');
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};