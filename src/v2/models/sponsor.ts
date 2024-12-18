import mongoose, { Document } from 'mongoose';

interface ISponsor extends Document {
  name: string;
  logo_path: string; // Make sure the field name matches your database
  video_path: string;
  website_url: string;
  questions: mongoose.Types.ObjectId[];
}

const sponsorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo_path: { type: String, required: true }, // This should match the logo field in your database
  video_path: { type: String, required: true},
  website_url: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref:"MultipleChoice"}],
});

const Sponsor = mongoose.model<ISponsor>('Sponsor', sponsorSchema);

export default Sponsor;
