import mongoose, { Document } from 'mongoose';

interface ISponsor extends Document {
  name: string;
  logoPath: string; // Make sure the field name matches your database
  videoPath: string;
  websiteUrl: string;
  questions: mongoose.Types.ObjectId[];
}

const sponsorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoPath: { type: String, required: true }, // This should match the logo field in your database
  videoPath: { type: String, required: true},
  websiteUrl: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref:"MultipleChoice"}],
});

const Sponsor = mongoose.model<ISponsor>('Sponsor', sponsorSchema);

export default Sponsor;
