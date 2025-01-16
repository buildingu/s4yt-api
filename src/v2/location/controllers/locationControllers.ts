import { Request, Response } from "express";
import { locationDTO } from "../dtos/locationDTO";
import * as locationServices from "../services/locationServices";

const getCities = async (req: locationDTO, res: Response) => {
  try {
    const regionName = req.body.name;
    const cityInfo = await locationServices.getCities(regionName);
    res.status(200).json(cityInfo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
const getCountries = async (req: any, res: Response) => {
  try {
    const countries = await locationServices.getCountries();
    res.status(200).json(countries);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
const getRegions = async (req: locationDTO, res: Response) => {
  try {
    const countryName = req.body.name;
    const regionInfo = await locationServices.getRegions(countryName);
    res.status(200).json(regionInfo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export { getCities, getCountries, getRegions };
