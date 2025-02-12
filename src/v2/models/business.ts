import mongoose, { Schema, Types } from 'mongoose';

const businessSchema = new Schema({
  name: { type: String, required: true },
  logo_s4yt: { type: String, default: null },
  logo_normal: { type: String, default: null },
  description: { type: String, default: null },
  business_user_id: { type: Types.ObjectId, ref: 'User', required: true },
  meet_members_confirmed: [{ type: Types.ObjectId, ref: 'User' }],
  meet_members_interested: [{ type: Types.ObjectId, ref: 'User' }],
  attachment: { type: String, default: null },
  video_urls: [{ type: String, default: null }],
  questions: [{ type: Types.ObjectId, ref: 'Question' }],
  winners: [
    {
      winnerId: { type: Types.ObjectId, ref: 'User' },
      award: { type: Number, default: 0, min: 0 }
    }
  ],
  award: { type: Number, default: 0, min: 0 },
  awardedTotal: { type: Number, default: 0, min: 0 },
  deleted: { type: Boolean, default: false }
}, {collection : "businesses"});

const Business = mongoose.model('Business', businessSchema);

export default Business;
