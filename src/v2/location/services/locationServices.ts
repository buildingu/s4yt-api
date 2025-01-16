import { HttpError } from "../../middleware/errorHandler";
import City from "../../models/cities";
import Country from "../../models/countries";
import Regions from "../../models/region";

const getCities = async (regionName: string) => {
  const cities = await City.find({ region_name: regionName });
  return (
    cities ||
    "No cities were found from your selected region, you can skip this step."
  );
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
    return "No regions were found for the selected country, you can skip this step.";
  }
  const regionInfo = country.regions;
  return (
    regionInfo ||
    "No regions were found for the selected country, you can skip this step."
  );
};

export { getCities, getCountries, getRegions };
