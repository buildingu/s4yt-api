import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo_s4yt: { type: String, default: null },
  logo_normal: { type: String, default: null },
  description: { type: String, default: null },
  meet_members_confirmed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  meetMembers_interested: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attachment: { type: String, default: null },
  video_urls: [{ type: String, default: null }],
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
}, {collection : "businesses"});

const Business = mongoose.model('Business', businessSchema);

export default Business;
