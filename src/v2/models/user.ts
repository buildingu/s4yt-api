import { model, Schema, Types } from 'mongoose';
import User, { userEducation, userRoles } from '../typings/User';
import { coinTransactionSchema } from './coinTransaction';

const userSchema = new Schema<User>({
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true
  },
  name: {
    type: String,
    default: null,
    minlength: [2, 'Name is too short. Minimum length is 2 characters.'],
    maxlength: [128, 'Name is too long. Maximum length is 128 characters.']
  },
  education: {
    type: String,
    enum: userEducation
  },
  school: { type: String, default: null },
  password: { type: String, required: true },
  country: { type: String, default: null },
  region: { type: String, default: null },
  city: {
    type: String,
    default: null,
    maxlength: [50, 'City name is too long. Maximum length is 50 characters.']
  },
  chests_submitted: { type: Map, of: Number },
  is_email_verified: { type: Boolean, default: false },
  email_verification_token: { type: String, default: null },
  reset_password_token: { type: String, default: null },
  role: { 
    type: String, 
    enum: userRoles, 
    required: true 
  },
  coins: { type: Number, default: 0 },
  coin_transactions: [coinTransactionSchema],
  referral_code: { type: String, default: null },
  accepted_referrals: [{ type: Types.ObjectId, ref: 'AcceptedReferral' }],
  inviter_referral_code: { type: String, default: '' },
  first_login: { type: Boolean, default: true },
  kicked: { type: Boolean, default: false },
  banned_until: { type: Date, default: null },
  attend_meeting: { type: Boolean, default: false }
}, {
  timestamps: {
    createdAt: 'created_at', // Use `created_at` to store the created date
    updatedAt: 'updated_at' // and `updated_at` to store the last updated date
  }
});

const UserModel = model('User', userSchema);

export default UserModel;