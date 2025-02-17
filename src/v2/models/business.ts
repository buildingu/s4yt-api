import { randomUUID } from 'crypto';
import mongoose, { Schema, Types } from 'mongoose';
import { Business } from '../typings/Business';

const businessSchema = new Schema<Business>({
  name: { type: String, required: true },
  business_id: { type: String, default: () => randomUUID()},
  logo_s4yt: { type: String, default: null },
  logo_normal: { type: String, default: null },
  description: { type: String, default: null },
  attend_meeting: {type: Boolean, default: false },
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
}, {collection : 'businesses'});

const Business = mongoose.model('Business', businessSchema);

export default Business;
