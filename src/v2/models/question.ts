import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  description: String,
  prizeAllocation: [{
    place: Number,
    amount: Number,
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null}
  }],
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' }
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
