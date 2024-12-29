export default interface User {
  id: string;
  city?: string | null;
  country?: string;
  email: string;
  education?: string;
  name?: string;
  password: string;
  quiz_submitted: number;
  referral_link: string;
  region?: string | null;
  school?: string | null;
  is_email_verified: boolean;
  email_verification_token: string;
  reset_password_token: string;
  token_version: number;
  role: 'Admin' | 'Business' | 'Player';
  referer_code: string;
  used_refer_code: boolean;
  kicked?: boolean; 
  banned_until?: Date;
  coins: number;
  show_instructions: boolean;
}
