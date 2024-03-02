export default interface User {
  id: string;
  city_id: number | null;
  country_id: number;
  education_id: number;
  email: string;
  grade_id: number;
  instagram_handle: string | null;
  name: string;
  password: string;
  quiz_submitted: number;
  referral_link: string;
  region_id: number | null;
  roles: string[];
  school: string | null;
  isEmailVerified: boolean;
  emailVerificationToken: string;
  resetPasswordToken: string;
  tokenVersion: number;
}