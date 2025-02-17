import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  challenge: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Challenge', 
    required: true 
  },
  business: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Business', 
    required: true 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  link: { 
    type: String, 
    required: true 
  }
});

const Answer = mongoose.model('Answer', answerSchema);

export default Answer;
