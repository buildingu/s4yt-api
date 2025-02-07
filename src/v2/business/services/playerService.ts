import User from '../../models/user';
import { v4 as uuidv4 } from 'uuid';

export const registerPlayer = async (playerData: any) => {
  const referralCode = uuidv4();
  const newUser = new User({
    ...playerData,
    role: 'Player',
    referralCode,
    coins: 50 // Starting coins
  });

  await newUser.save();
  return newUser;
};

export const validateReferralCode = async (referralCode: string) => {
  const referrer = await User.findOne({ referralCode });

  if (referrer) {
    referrer.coins += 5;
    await referrer.save();
    return true;
  }

  return false;
};
