import City from "../../models/cities";
import Country from "../../models/countries";
import Regions from "../../models/region";

const getOneCity = async (cityName: string) => {
  const cityInfo = await City.findOne({ name: cityName });
  if (!cityInfo) {
    throw new Error("City not found!");
  }
  return cityInfo;
};
const getOneCountry = async (countryName: string) => {
  const countryInfo = await Country.findOne({ name: countryName });
  if (!countryInfo) {
    throw new Error("Country not found!");
  }
  return countryInfo;
};
const getOneRegion = async (regionName: string) => {
  const country = await Regions.findOne({ "regions.name": regionName });
  if (!country) {
    throw new Error("Regions not found!");
  }
  const regionInfo = country.regions.find(
    (region) => region.name === regionName
  );
  return regionInfo || "Regions not found!";
};

export { getOneCity, getOneCountry, getOneRegion };
