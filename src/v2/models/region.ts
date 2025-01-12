import mongoose from "mongoose";
const { Schema, model, Document } = mongoose;

const oneRegion = new Schema({
  name: String,
  abbr: String,
});

const regionSchema = new Schema({
  countryName: { type: String, required: true },
  abbr: { type: String, required: true },
  regions: [oneRegion],
});

const Regions = model("Region", regionSchema);
export default Regions;
