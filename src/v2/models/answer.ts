import { Schema, model } from 'mongoose';
import { Answer } from '../typings/Answer';

const answerSchema = new Schema<Answer>({
  user: {
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  challenge_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Challenge', 
    required: true 
  },
  rating: Number,
  submission_link: String,
  timestamp: Date,
  deleted: { type: Boolean, default: false }
});

const Answer = model('Answer', answerSchema);

export default Answer;
