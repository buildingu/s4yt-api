import { Request, Response } from 'express';
import * as businessIslandService from '../services/busIslandService';

export const getBusinesses = async (req: Request, res: Response) => {
  try {
    const allBusinesses = await businessIslandService.getBusinesses();
    res.json(allBusinesses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};