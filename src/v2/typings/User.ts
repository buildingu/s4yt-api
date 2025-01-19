import mongoose, { Types } from 'mongoose';
import { CoinTransaction } from './CoinTransaction';
import { userEducation, userRoles } from './userEnums';

export default interface User {
  city?: string | null;
  country?: string;
  email: string;
  education?: typeof userEducation[number] | null;
  name?: string;
  password: string;
  quiz_submitted: number;
  region?: string | null;
  school?: string | null;
  is_email_verified: boolean;
  email_verification_token: string;
  reset_password_token: string;
  token_version: number;
  role: typeof userRoles[number];
  referral_code: string;
  accepted_referrals: Types.ObjectId[];
  kicked?: boolean; 
  banned_until?: Date;
  coins: number;
  coin_transactions: CoinTransaction[],
  show_instructions: boolean;
}
