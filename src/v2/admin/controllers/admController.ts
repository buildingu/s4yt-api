import { NextFunction, Request, Response } from 'express';
import * as superAdminService from '../services/admService';
import { CreateChestRequestDto } from '../dtos/AdminDto';

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const response = await superAdminService.loginAdmin(email, password);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
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

export const getAllBusinesses = async (req: Request, res: Response) => {
  try {
    const businesses = await superAdminService.retrieveAllBusinesses();
    res.status(200).json(businesses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const editBusinessChallenge = async (req: Request, res: Response) => {
  try {
    const { challengeId, challengeData } = req.body;
    await superAdminService.editChallenge(challengeId, challengeData);
    res.status(200).send('Challenge edited successfully');
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const getRSVPedUsers = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const emails = await superAdminService.getRSVPedUsers();
    res.status(200).json(emails);
  } catch (error) {
    next(error);
  }
}