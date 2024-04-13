import mongoose, { Document } from 'mongoose';

interface ISponsor extends Document {
  name: string;
  logoPath: string; // Make sure the field name matches your database
  websiteUrl: string;
}

const sponsorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoPath: { type: String, required: true }, // This should match the logo field in your database
  websiteUrl: { type: String, required: true },
});

const Sponsor = mongoose.model<ISponsor>('Sponsor', sponsorSchema);

export default Sponsor;
