import { Request, Response } from "express";
import { locationDTO } from "../dtos/locationDTO";
import * as locationServices from "../services/locationServices";

const getCities = async (req: locationDTO, res: Response) => {
  try {
    const city = req.body;
    const cityInfo = locationServices.getOneCity(city);
    res.status(200).json(cityInfo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
const getCountry = async (req: locationDTO, res: Response) => {
  try {
    const country = req.body;
    const countryInfo = locationServices.getOneCountry(country);
    res.status(200).json(countryInfo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
const getRegion = async (req: locationDTO, res: Response) => {
  try {
    const region = req.body;
    const regionInfo = locationServices.getOneRegion(region);
    res.status(200).json(regionInfo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export { getCities, getCountry, getRegion };
