import mongoose, { Schema, Types } from 'mongoose';
import { Business } from '../typings/Business';

const businessSchema = new Schema<Business>({
  name: { type: String, required: true },
  admin_business_id: { type: String, default: ''},
  logo_s4yt: { type: String, default: null },
  logo_normal: { type: String, default: null },
  description: { type: String, default: null },
  attend_meeting: {type: Boolean, default: false },
  attachment: { type: String, default: null },
  video_url: { type: String, default: null },
  video_title: { type: String, default: null },
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  chests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chest' }],
  winners: [
    {
      winnerId: { type: Types.ObjectId, ref: 'User' },
      award: { type: Number, default: 0, min: 0 }
    }
  ],
  award: { type: Number, default: 0, min: 0 },
  awardedTotal: { type: Number, default: 0, min: 0 },
  deleted: { type: Boolean, default: false }
}, {collection : 'businesses'});

const Business = mongoose.model('Business', businessSchema);

export default Business;
