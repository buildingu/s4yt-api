import { Types } from 'mongoose';
import { CoinTransaction } from './CoinTransaction';
import { userEducation, userRoles } from './userEnums';

export default interface User {
  city?: string | null;
  country?: string;
  email: string;
  education?: typeof userEducation[number] | null;
  school?: string | null;
  name?: string;
  password: string;
  chests_submitted: Map<string, number>;
  attend_meeting: boolean;
  region?: string | null;
  is_email_verified: boolean;
  email_verification_token: string;
  reset_password_token: string;
  role: typeof userRoles[number];
  referral_code: string;
  accepted_referrals: Types.ObjectId[];
  kicked?: boolean; 
  banned_until?: Date;
  coins: number;
  coin_transactions: CoinTransaction[]
}
