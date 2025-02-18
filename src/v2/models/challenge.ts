import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' }
});

const ChallengeModel = mongoose.model('Challenge', challengeSchema);

export default ChallengeModel;
