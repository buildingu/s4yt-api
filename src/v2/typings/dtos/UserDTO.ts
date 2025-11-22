
import { userEducation, userRoles } from '../User';

export default interface UserDTO {
  city?: string | null;
  country?: string;
  education?: typeof userEducation[number] | null;
  email: string;
  name?: string;
  referral_link: string;
  chests_submitted: Record<string, number>;
  region?: string | null;
  role: typeof userRoles[number];
  school?: string | null;
  attend_meeting: boolean;
}