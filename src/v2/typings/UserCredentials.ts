import { userEducation, userRoles } from './userEnums';

export default interface UserCredentials {
  id: string;
  city: string | null;
  country: string;
  education: typeof userEducation[number] | null;
  email: string;
  name: string;
  quiz_submitted: number;
  referral_link: string;
  region: string | null;
  roles: typeof userRoles[number] | null;
  school: string | null;
}
