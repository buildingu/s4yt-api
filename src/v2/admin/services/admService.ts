import User from '../../models/user';
import Challenge from '../../models/challenge';
import Business from '../../models/business';
import ChestModel from '../../models/chest';
import MultipleChoiceModel from '../../models/multipleChoice';
import { LoginResponse } from '../dtos/AdminDto';
import { compare } from "bcrypt";
import jwt from 'jsonwebtoken';

export const loginAdmin = async (email: string, password: string): Promise<LoginResponse> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email");
  }

  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const business = user.role === "Business"
    ? await Business.findOne({ business_user_id: user._id }).select("_id")
    : null;

  const token = jwt.sign(
    { userId: user._id, roles: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  return {
    token,
    userData: {
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
      businessId: business?._id?.toString() || null,
    },
  };
};

export const retrieveAllUsers = async () => {
  const users = await User.find({});
  return users;
};

export const retrieveAllBusinesses = async () => {
  const businesses = await Business.find({});
  return businesses;
};

export const kickOutUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.kicked = true;
  await user.save();
};

export const banAUser = async (userId: string, duration: number) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.banned_until = new Date(Date.now() + duration);
  await user.save();
};

export const createBusiness = async (name: string, logo: string, description: string) => {
  const business = new Business({
    name,
    logo,
    description
  });
  await business.save();
}

export const editChallenge = async (challengeId: string, challengeData: any) => {
  const challenge = await Challenge.findByIdAndUpdate(challengeId, challengeData, { new: true });
  if (!challenge) {
    throw new Error('Challenge not found');
  }
  return challenge;
};

export const createChest = async (chestGroupData: any) => {
  const chestGroup = await Promise.all(
    chestGroupData.map(async (challengeData: any) => {
      const multipleChoice = new MultipleChoiceModel(challengeData);
      await multipleChoice.save();
      return multipleChoice;
    })
  );

  const chest = new ChestModel({
    group: chestGroup
  });

  await chest.save();
  return chest;
}