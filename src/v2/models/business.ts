import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: String,
  description: String,
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
});

const Business = mongoose.model('Business', businessSchema);

export default Business;
