import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoS4yt: { type: String, default: null },
  logoNormal: { type: String, default: null },
  description: { type: String, default: null },
  meetStartTime: { type: Date, default: null },
  meetEndTime: { type: Date, default: null },
  attachment: { type: String, default: null },
  videoUrls: [{ type: String, default: null }],
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
}, {collection : "businesses"});

const Business = mongoose.model('Business', businessSchema);

export default Business;
