import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  text: { type: String, required: true },
  description: String,
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' }
});

const ChallengeModel = mongoose.model('Challenge', challengeSchema);

export default ChallengeModel;
