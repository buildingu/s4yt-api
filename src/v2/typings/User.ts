export default interface User {
  id: string;
  cityId?: number | null;
  countryId?: number;
  provinceState?: number | null;
  email: string;
  grade?: number;
  instagramHandle?: string | null;
  name?: string;
  password: string;
  quizSubmitted: number;
  referralLink: string;
  regionId: number | null;
  school?: string | null;
  isEmailVerified: boolean;
  emailVerificationToken: string;
  resetPasswordToken: string;
  tokenVersion: number;
  role: 'Admin' | 'Business' | 'Player';
  refererCode: string;
  usedReferCode: boolean;
  kicked?: boolean; 
  bannedUntil?: Date;
  coins: number;
  showInstructions: boolean;
}
