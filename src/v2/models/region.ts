import { Schema, model } from 'mongoose';
import { Region } from '../typings/Region';

const regionSchema = new Schema<Region>({
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

const Regions = model('Region', regionSchema);
export default Regions;
