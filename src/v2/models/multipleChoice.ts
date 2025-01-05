import mongoose from 'mongoose';

const multipleChoiceSchema = new mongoose.Schema({
  prompt: {type: String, required: true},
  answers: {type: Array<String>, required: true},
  correct_answer: {type: String, required: true},
  sponsor: { type: mongoose.Schema.Types.ObjectId, ref: 'Sponsor' } 
});

const MultipleChoice = mongoose.model('MultipleChoice', multipleChoiceSchema);

export default MultipleChoice;
