import mongoose from 'mongoose';

const sponsorSchema = new mongoose.Schema({
  name: String,
  logoUrl: String,
  websiteUrl: String
});

const Sponsor = mongoose.model('Sponsor', sponsorSchema);

export default Sponsor;
