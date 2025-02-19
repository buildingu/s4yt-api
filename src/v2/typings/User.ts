import { Types } from 'mongoose';
import { userEducation, userRoles } from './userEnums';

export default interface User {
  email: string;
  name?: string;
  education?: typeof userEducation[number] | null;
  school?: string | null;
  password: string;
  country?: string;
  region?: string | null;
  city?: string | null;
  chests_submitted: Map<string, number>;
  is_email_verified: boolean;
  email_verification_token: string;
  reset_password_token: string;
  role: typeof userRoles[number];
  coins: number;
  coin_transactions: Types.ObjectId[];
  referral_code: string;
  accepted_referrals: Types.ObjectId[];
  kicked?: boolean; 
  banned_until?: Date;
  attend_meeting: boolean;
}
