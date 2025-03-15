import { Request, Response, NextFunction } from "express";
import * as businessService from '../services/busService';
import { GetEventResultsRequestDto, GetAwardRequestDto } from '../dtos/BusinessDto';
import { CustomJwtPayload } from "../../typings/express/Request";
import { HttpError } from "../../middleware/errorHandler";

export const sendBusinessesInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.decodedClaims as CustomJwtPayload)?.userId;
    if (!userId) {
      throw new HttpError('User is not authenticated', 401);
    }

    const allBusinesses = await businessService.sendBusinessesInfo(userId);
    res.json(allBusinesses);
  } catch (error: any) {
    next(error);
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