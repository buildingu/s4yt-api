import mongoose from "mongoose";
import { Country } from "../typings/Countries";
const { Schema, model } = mongoose;

const countrySchema = new Schema<Country>({
  name: { type: String, required: true },
  abbr: { type: String, required: true },
  callingCode: { type: String, required: true },
  continent: { type: String, required: true },
});

const Country = model("Country", countrySchema);
export default Country;
