import mongoose, { Schema, Types } from 'mongoose';
import { Business } from '../typings/Business';

const businessSchema = new Schema<Business>({
  name: { type: String, required: true },
  business_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  admin_business_id: { type: String, default: ''},
  logo: { type: String, default: null },
  description: { type: String, default: null },
  video_url: { type: String, default: null },
  video_title: { type: String, default: null },
  challenge_question: { type: Schema.Types.ObjectId, ref: 'Challenge' },
  winners: [
    {
      winner_id: { type: Types.ObjectId, ref: 'User' },
      award: { type: Number, default: 0, min: 0 }
    }
  ],
  award: { type: Number, default: 0, min: 0 },
  awarded_total: { type: Number, default: 0, min: 0 },
  deleted: { type: Boolean, default: false }
}, {collection : 'businesses'});

const Business = mongoose.model('Business', businessSchema);

export default Business;
