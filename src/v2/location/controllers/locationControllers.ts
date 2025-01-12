import { Request, Response } from "express";
import { locationDTO } from "../dtos/locationDTO";

const getCities = async (req: locationDTO, res: Response) => {
  try {
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
const getCountry = async (req: locationDTO, res: Response) => {
  try {
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
const getRegion = async (req: locationDTO, res: Response) => {
  try {
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export { getCities, getCountry, getRegion };
