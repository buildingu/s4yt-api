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
  rating: { type: Number, default: 0 },
    submission_link: String,
    deleted: { type: Boolean, default: false }
  }, {
  timestamps: {
    createdAt: 'timestamp',
    updatedAt: false
  }
});

const Answer = model('Answer', answerSchema);

export default Answer;
