import { Schema, model } from 'mongoose';
import { MultipleChoice } from '../typings/MultipleChoice';

const multipleChoiceSchema = new Schema<MultipleChoice>({
  business_id: { type: Schema.Types.ObjectId, ref: 'AdminBusiness'},
  chest_id: { type: Schema.Types.ObjectId, ref: 'Chest'},
  question: {type: String, required: true},
  answers: {
    choices: { type: Map, of: String },
    correct: { type: String, required: true},
    explanation: String
  }
});

const MultipleChoiceModel = model('MultipleChoice', multipleChoiceSchema);

export default MultipleChoiceModel;
