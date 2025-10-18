import User from '../../typings/User';
import UserDTO from '../../typings/UserDTO';

export const createUserCredentials = (user: User): UserDTO => {
  return {
    city: user.city || null,
    country: user.country || "",
    education: user.education || null,
    email: user.email,
    name: user.name || "",
    referral_link: `${process.env.FRONTEND_URL}/register?referral_code=${user.referral_code}`,
    chests_submitted: Object.fromEntries(user.chests_submitted),
    region: user.region || null,
    role: user.role || null,
    school: user.school || null,
    attend_meeting: user.attend_meeting
  };
}