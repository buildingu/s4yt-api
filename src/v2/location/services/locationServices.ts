import { HttpError } from "../../middleware/errorHandler";
import City from "../../models/cities";
import Country from "../../models/countries";
import Regions from "../../models/region";

export const getCountries = async () => {
  const countries = await Country.find();
  return countries;
};

export const getRegions = async (countryName: string) => {
  const selected = await Regions.findOne({ countryName: countryName });
  return (
    selected?.regions ||
    "No regions were found from your selected country, you can skip this step."
  );
};

export const getCities = async (regionName: string) => {
  const cities = await City.find({ region_name: regionName });
  return (
    cities ||
    "No cities were found from your selected region, you can skip this step."
  );
};
