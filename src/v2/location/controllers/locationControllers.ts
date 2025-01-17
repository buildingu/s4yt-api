import { Request, Response, NextFunction } from "express";
import { locationDTO } from "../dtos/locationDTO";
import * as locationService from "../services/locationServices";

export const getCountries = async (req: any, res: Response, next: NextFunction) => {
  try {
    const countries = await locationService.getCountries();
    
    res.status(200).json({ countries });
  } catch (error: any) {
    next(error);
  }
};

export const getRegions = async (req: locationDTO, res: Response, next: NextFunction) => {
  try {
    const regions = await locationService.getRegions(req.body.name);
    
    res.status(200).json({ regions });
  } catch (error: any) {
    next(error);
  }
};

export const getCities = async (req: locationDTO, res: Response, next: NextFunction) => {
  try {
    const cities = await locationService.getCities(req.body.name);
    
    res.status(200).json({ cities });
  } catch (error: any) {
    next(error);
  }
};
