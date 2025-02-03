import mongoose, { Schema } from 'mongoose';
import { MultipleChoice } from '../typings/MultipleChoice';

const multipleChoiceSchema = new Schema<MultipleChoice>({
  question: {type: String, required: true},
  answers: {
    choices: { type: Map, of: String },
    correct: { type: String, required: true},
    explanation: String
  }
});

const MultipleChoiceModel = mongoose.model('MultipleChoice', multipleChoiceSchema);

export default MultipleChoiceModel;
