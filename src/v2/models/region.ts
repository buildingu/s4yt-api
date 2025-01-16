import mongoose from "mongoose";
const { Schema, model, Document } = mongoose;

const regionSchema = new Schema({
  countryName: { type: String, required: true },
  abbr: { type: String, required: true },
  regions: [
    {
      _id: false,
      name: String,
      abbr: String,
    },
  ],
});

const Regions = model("Region", regionSchema);
export default Regions;
