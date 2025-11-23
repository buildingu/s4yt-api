import { Schema, Types, model } from 'mongoose';
import { Business } from '../typings/Business';

// NOTE: Businesses are Challenge Partner, *not* Raffle Partners
const businessSchema = new Schema<Business>({
  admin_business_id: { type: Schema.Types.ObjectId, ref: 'AdminBusiness' },
  name: { type: String, required: true },
  logo: { type: String, default: null },
  link: { type: String, default: null },
  description: { type: String, default: null },
  video_url: { type: String, default: null },
  video_title: { type: String, default: null },
  challenge_question: { type: Schema.Types.ObjectId, ref: 'Challenge' },
  winners: [
    {
      user_id: { type: Types.ObjectId, ref: 'User' },
      award: { type: Number, default: 0, min: 0 }
    }
  ],
  award_limit: { type: Number, default: 0, min: 0 },
  awarded_total: { type: Number, default: 0, min: 0 },
  deleted: { type: Boolean, default: false }
}, {collection : 'businesses'});

const Business = model('Business', businessSchema);

export default Business;
