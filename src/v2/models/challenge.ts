import { Schema, model } from 'mongoose';
import { Challenge } from '../typings/Challenge';

// Challenge Question
const challengeSchema = new Schema<Challenge>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  business: { type: Schema.Types.ObjectId, ref: 'Business' }, // -> AdminBusiness
  deleted: { type: Boolean, default: false }
});

const ChallengeModel = model('Challenge', challengeSchema);

export default ChallengeModel;
