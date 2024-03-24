import { Document, model, Schema, Types } from 'mongoose';
import User from "../typings/User";

const userSchema = new Schema<User & Document>({
  id: { type: String, default: null },
  city_id: { type: Number, default: null },
  country_id: { type: Number, default: null },
  education_id: { type: Number, default: null },
  email: { type: String, required: true, unique: true },
  grade_id: { type: Number, default: null },
  province_state: { type: Number, default: null },
  instagram_handle: { type: String, default: null },
  name: { type: String, default: null },
  password: { type: String, required: true },
  quiz_submitted: { type: Number, default: null  },
  referral_link: { type: String, default: null },
  region_id: { type: Number, default: null },
  school: { type: String, default: null },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, default: null },
  resetPasswordToken: { type: String, default: null },
  tokenVersion: { type: Number, default: 0 },
  role: { 
    type: String, 
    enum: ['Admin', 'Business', 'Player'], 
    required: true 
  },
  coins: { type: Number, default: 50 },
  referer_Code: { type: String, default: null },
  used_refer_code: { type: Boolean, default: false },
  kicked: { type: Boolean, default: false },
  bannedUntil: { type: Date, default: null },
}, {
  timestamps: true, 
});

const UserModel = model<User & Document>('User', userSchema);

export default UserModel;