import { Schema, model } from 'mongoose';

// Unused
const citySchema = new Schema({
  name: { type: String, required: true },
  region: { type: String, required: true },
  country: { type: String, required: true },
  wikiDataID: { type: String, required: true },
});

const City = model('City', citySchema);
export default City;
