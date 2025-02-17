import { Document, model, Schema, Types } from 'mongoose';
import User from '../typings/User';
import { userEducation, userRoles } from '../typings/userEnums';
import { coinTransactionSchema } from './coinTransaction';

const userSchema = new Schema<User & Document>({
  city: { type: String, default: null },
  country: { type: String, default: null },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true
  },
  education: {
    type: String,
    enum: userEducation
  },
  school: { type: String, default: null },
  name: { type: String, default: null, minlength: 2, maxlength: 128 },
  password: { type: String, required: true },
  chests_submitted: { type: Map, of: Number },
  attend_meeting: { type: Boolean, default: false },
  region: { type: String, default: null },
  is_email_verified: { type: Boolean, default: false },
  email_verification_token: { type: String, default: null },
  reset_password_token: { type: String, default: null },
  token_version: { type: Number, default: 0 },
  role: { 
    type: String, 
    enum: userRoles, 
    required: true 
  },
  coins: { type: Number, default: 0 },
  coin_transactions: [coinTransactionSchema],
  referral_code: { type: String, default: null },
  accepted_referrals: [{ type: Types.ObjectId, ref: 'AcceptedReferral' }],
  kicked: { type: Boolean, default: false },
  banned_until: { type: Date, default: null },
  show_instructions: { type: Boolean, default: true },
}, {
  timestamps: {
    createdAt: 'created_at', // Use `created_at` to store the created date
    updatedAt: 'updated_at' // and `updated_at` to store the last updated date
  }
});

const UserModel = model<User & Document>('User', userSchema);

export default UserModel;