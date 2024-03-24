import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  question: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Question', 
    required: true 
  },
  business: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Business', 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
});

const Answer = mongoose.model('Answer', answerSchema);

export default Answer;
