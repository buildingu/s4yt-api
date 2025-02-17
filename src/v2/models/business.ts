import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo_s4yt: { type: String, default: null },
  logo_normal: { type: String, default: null },
  description: { type: String, default: null },
  meet_members_confirmed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  meet_members_interested: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attachment: { type: String, default: null },
  video_urls: [{ type: String, default: null }],
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  chests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chest' }],
  winners: [
    {
      winnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      award: { type: Number, default: 0, min: 0 }
    }
  ],
  award: { type: Number, default: 0, min: 0 },
  awardedTotal: { type: Number, default: 0, min: 0 } 
}, {collection : "businesses"});

const Business = mongoose.model('Business', businessSchema);

export default Business;
