import { Document, model, Schema, Types } from 'mongoose';
import User from "../typings/User";

const userSchema = new Schema<User & Document>({
  id: { type: String, default: null },
  cityId: { type: Number, default: null },
  countryId: { type: Number, default: null },
  // education_id: { type: Number, default: null },
  email: { type: String, required: true, unique: true },
  grade: { type: Number, default: null },
  provinceState: { type: Number, default: null },
  instagramHandle: { type: String, default: null },
  name: { type: String, default: null },
  password: { type: String, required: true },
  quizSubmitted: { type: Number, default: null  },
  referralLink: { type: String, default: null },
  regionId: { type: Number, default: null },
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
  refererCode: { type: String, default: null },
  usedReferCode: { type: Boolean, default: false },
  kicked: { type: Boolean, default: false },
  bannedUntil: { type: Date, default: null },
  showInstructions: { type: Boolean, default: true },
}, {
  timestamps: true, 
});

const UserModel = model<User & Document>('User', userSchema);

export default UserModel;