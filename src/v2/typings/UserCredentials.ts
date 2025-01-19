import { userEducation, userRoles } from './userEnums';

export default interface UserCredentials {
  id: string;
  city: string | null;
  country: string;
  education: typeof userEducation[number] | null;
  email: string;
  name: string;
  referral_link: string;
  quiz_submitted: number;
  region: string | null;
  roles: typeof userRoles[number] | null;
}
