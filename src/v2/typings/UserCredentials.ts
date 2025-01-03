export default interface UserCredentials {
  id: string;
  city: string | null;
  country: string;
  education: string;
  email: string;
  name: string;
  quiz_submitted: number;
  referral_link: string;
  region: string | null;
  roles: Array<string>;
  school: string | null;
}
