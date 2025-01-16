import { HttpError } from "../../middleware/errorHandler";
import City from "../../models/cities";
import Country from "../../models/countries";
import Regions from "../../models/region";

const getCities = async (regionName: string) => {
  const cities = await City.find({ region_name: regionName });
  return cities || "Cities not Found!";
};
const getCountries = async () => {
  const countries = await Country.find();
  return countries;
};
const getRegions = async (countryName: string) => {
  const country = await Regions.collection.findOne({
    countryName: countryName,
  });
  if (!country) {
    return "No Regions Found!";
  }
  const regionInfo = country.regions;
  return regionInfo || "No Regions Found!";
};

export { getCities, getCountries, getRegions };
