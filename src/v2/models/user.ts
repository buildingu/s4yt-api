import { Document, model, Schema } from 'mongoose';
import User from "../typings/User";

const userSchema = new Schema<User & Document>({
  id: { type: String, default: null },
  city: { type: String, default: null },
  country: { type: String, default: null },
  email: { type: String, required: true, unique: true },
  education: {
    type: String,
    enum: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Other']
  },
  name: { type: String, default: null, minlength: 2, maxlength: 128 },
  password: { type: String, required: true },
  quiz_submitted: { type: Number, default: null  },
  referral_link: { type: String, default: null },
  region: { type: String, default: null },
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
  timestamps: {
    createdAt: 'created_at', // Use `created_at` to store the created date
    updatedAt: 'updated_at' // and `updated_at` to store the last updated date
  }
});

const UserModel = model<User & Document>('User', userSchema);

export default UserModel;