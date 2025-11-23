import { Schema, model } from 'mongoose';
import { Challenge } from '../typings/Challenge';

// Challenge Question
const challengeSchema = new Schema<Challenge>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  business: { type: Schema.Types.ObjectId, ref: 'AdminBusiness' }, // Temporarily change this from Business to AdminBusiness to conform to admin panel
  deleted: { type: Boolean, default: false }
});

const ChallengeModel = model('Challenge', challengeSchema);

export default ChallengeModel;
