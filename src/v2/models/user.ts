import { Document, model, Schema, Types } from 'mongoose';
import User from "../typings/User";

const userSchema = new Schema<User & Document>({
  id: { type: String, default: null },
  city_id: { type: Number, default: null },
  country_id: { type: Number, default: null },
  email: { type: String, required: true, unique: true },
  grade: { type: Number, default: null },
  province_state: { type: Number, default: null },
  name: { type: String, default: null }, // TODO: set min and max length
  password: { type: String, required: true },
  quiz_submitted: { type: Number, default: null  },
  referral_link: { type: String, default: null },
  region_id: { type: Number, default: null },
  school: { type: String, default: null },
  is_email_verified: { type: Boolean, default: false },
  email_verification_token: { type: String, default: null },
  reset_password_token: { type: String, default: null },
  token_version: { type: Number, default: 0 },
  role: { 
    type: String, 
    enum: ['Admin', 'Business', 'Player'], 
    required: true 
  },
  coins: { type: Number, default: 50 },
  referer_code: { type: String, default: null },
  used_refer_code: { type: Boolean, default: false },
  kicked: { type: Boolean, default: false },
  banned_until: { type: Date, default: null },
  show_instructions: { type: Boolean, default: true },
}, {
  timestamps: true, 
});

const UserModel = model<User & Document>('User', userSchema);

export default UserModel;