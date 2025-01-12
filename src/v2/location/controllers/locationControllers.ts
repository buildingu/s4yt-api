import { Request, Response } from "express";

const getCities = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
const getCountry = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
const getRegion = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export { getCities, getCountry, getRegion };
