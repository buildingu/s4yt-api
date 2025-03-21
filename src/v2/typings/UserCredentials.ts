import { userEducation, userRoles } from './userEnums';

export default interface UserCredentials {
  city?: string | null;
  country?: string;
  education?: typeof userEducation[number] | null;
  email: string;
  name?: string;
  referral_link: string;
  chests_submitted: Record<string, number>;
  region?: string | null;
  roles: typeof userRoles[number];
  school?: string | null;
}