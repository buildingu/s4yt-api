export default interface User {
  id: string;
  city_id?: number | null;
  country_id?: number;
  province_state?: number | null;
  email: string;
  grade?: number;
  name?: string;
  password: string;
  quiz_submitted: number;
  referral_link: string;
  region_id: number | null;
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
