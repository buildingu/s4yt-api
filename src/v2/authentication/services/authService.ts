import UserModel from "../../models/user";
import User from "../../typings/User";
import UserCredentials from "../../typings/UserCredentials";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../services/emailService";
import { HttpError, resolveErrorHandler } from "../../middleware/errorHandler";
import { isoTimestamps } from "../../configs/timestamps";
import { HydratedDocument } from "mongoose";
import { AcceptedReferralModel } from "../../models/acceptedReferrals";
import { awardCoinsToUser } from "../../utils/coins";
const { sign } = jwt;

const emailPattern =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordMinLength = 8;
const passwordMaxLength = 32;
const passwordPattern =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,32}$/;

const gameStartTimeMs = new Date(isoTimestamps.game_start).getTime();

export const csrf = async () => {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    return token;
  } catch (error) {
    throw new HttpError("Error generating CSRF token.", 500);
  }
};

export const getUser = async (email: string) => {
  try {
    const user = await UserModel.findOne({ email });
    return user;
  } catch (error) {
    throw new HttpError("Error fetching user.", 500);
  }
};

export const validatePassword = (password: string) => {
  if (
    password.length < passwordMinLength ||
    password.length > passwordMaxLength
  ) {
    return {
      valid: false,
      message: `Password must be between ${passwordMinLength} and ${passwordMaxLength} characters`,
    };
  }

  if (!passwordPattern.test(password)) {
    return {
      valid: false,
      message:
        "Password must contain at least one number, one lowercase and one uppercase letter, and one special character",
    };
  }

  return { valid: true, message: "Password is valid" };
};

const handleReferralBonus = async (newUser: HydratedDocument<User>, referralCode: string, amount: number) => {
  const invitingUser = await UserModel.findOne({ referral_code: referralCode });
  if (!invitingUser) {
    return false;
  }

  // Create a new accepted referral doc and save it 
  const acceptedReferral = new AcceptedReferralModel({
    invited_user: newUser,
    coins: amount,
  });

  await acceptedReferral.save();
  invitingUser.accepted_referrals.push(acceptedReferral._id);

  // Give and track bonus coins
  awardCoinsToUser(invitingUser, amount, 'referral', true);

  await invitingUser.save();

  return true;
};

export const register = async (userData: any) => {
  try {   
    if (!emailPattern.test(userData.email)) {
      throw new HttpError("Invalid email.", 400);
    }

    const existingUser = await getUser(userData.email);
    if (existingUser) {
      throw new HttpError("User already exists.", 409);
    }

    if (userData.password !== userData.password_confirmation) {
      throw new HttpError("Passwords do not match.", 400);
    }

    const { valid, message } = validatePassword(userData.password);
    if (!valid) {
      throw new HttpError(message, 400);
    }

    const hashedPassword = await hash(userData.password, 12);
    const inviterReferralCode = userData.referral_code;
    const newUserReferralCode = crypto.randomBytes(10).toString('hex');

    const newUser = new UserModel({
      ...userData,
      password: hashedPassword,
      role: userData.role || "Player",
      coin: userData.coin || 0,
      referral_code: newUserReferralCode,
      is_email_verified: false,
      email_verification_token: crypto.randomBytes(20).toString("hex"),
      chests_submitted: {},
    });

    awardCoinsToUser(newUser, 3, 'register', false);
    handleReferralBonus(newUser, inviterReferralCode, 5);

    if (process.env.SEND_EMAILS === 'true') {
      await sendVerificationEmail(newUser.email, newUser.email_verification_token);
    }

    await newUser.save();

    return newUser;
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};

export const resendVerificationEmail = async (email: string) => {
  try {
    const user = await UserModel.findOne({ email }, "-_id email email_verification_token", { lean: true });
    if (!user) {
      throw new HttpError("User does not exist.", 404);
    } else if (!user.email_verification_token) {
      throw new HttpError("User is already verified.", 204);
    }
    await sendVerificationEmail(user.email, user.email_verification_token);
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};

export const getAcceptedReferrals = async (userId: string) => {
  try {
    const user = await UserModel.findById(userId, 'accepted_referrals').populate({
      path: 'accepted_referrals',
      select: '-_id -__v',
      populate: {
        path: 'invited_user',
        select: '-_id name email'
      }
    });

    if (!user) {
      throw new HttpError('User not found', 404);
    }

    return user.accepted_referrals;
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};

export const login = async (loginData: { email: string; password: string }) => {
  try {
    const user = await UserModel.findOne(
      { email: loginData.email },
      "city coins country education email is_email_verified name password referral_code chests_submitted region role",
      { lean: true }
    );

    if (!user) {
      throw new HttpError("User does not exist.", 404);
    }

    const isMatch = await compare(loginData.password, user.password);
    if (!isMatch) {
      throw new HttpError("Invalid credentials.", 400);
    }

    if (!user.is_email_verified) {
      throw new HttpError(
        "Email is not verified. Please check your email to verify your account. If you lost your verification link, press Resend Verification Email above to get a new link.",
        400
      );
    }

    const userCredentials: UserCredentials = {
      city: user.city || null,
      country: user.country || "",
      education: user.education || null,
      email: user.email,
      name: user.name || "",
      referral_link: `${process.env.FRONTEND_URL}/register?referral_code=${user.referral_code}`,
      chests_submitted: user.chests_submitted,
      region: user.region || null,
      roles: user.role || null,
    };

    const jwtToken = sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const csrfToken = crypto.randomBytes(32).toString("hex");

    // If game or registration has started, send timestamps, otherwise send "not started" message
    const resTimestamps =
      gameStartTimeMs > Date.now()
        ? "The game has not started yet"
        : isoTimestamps;

    return {
      user: userCredentials,
      coins: user.coins,
      timestamps: resTimestamps,
      jwtToken,
      csrfToken,
    };
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};

export const verifyEmail = async (token: string) => {
  try {
    const user = await UserModel.findOne({ email_verification_token: token });
    if (!user) {
      throw new HttpError("User not found.", 404);
    }

    user.is_email_verified = true;
    user.email_verification_token = undefined!;
    await user.save();
    return user;
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};

export const initiatePasswordReset = async (email: string) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new HttpError("User not found.", 404);
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.reset_password_token = resetToken;
    await user.save();

    if (process.env.SEND_EMAILS === "true") {
      await sendResetPasswordEmail(email, resetToken);
    }
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const user = await UserModel.findOne({ reset_password_token: token });
    if (!user) {
      throw new HttpError("Invalid or expired password reset token.", 401);
    }

    const { valid, message } = validatePassword(newPassword);
    if (!valid) {
      throw new HttpError(message, 400);
    }

    const hashedPassword = await hash(newPassword, 12);
    user.password = hashedPassword;
    user.reset_password_token = undefined!;
    await user.save();
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};

export const updatePassword = async (
  userId: string | undefined,
  oldPassword: string,
  password: string,
  passwordConfirmation: string
) => {
  try {
    if (!oldPassword) {
      throw new HttpError("Current password is missing.", 400);
    }

    if (password !== passwordConfirmation) {
      throw new HttpError("Passwords do not match.", 400);
    }

    if (!userId) {
      throw new HttpError("User not found.", 404);
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new HttpError("User not found.", 404);
    }

    const isMatch = await compare(oldPassword, user.password);
    if (!isMatch) {
      throw new HttpError("Invalid credentials.", 401);
    }

    const { valid, message } = validatePassword(password);
    if (!valid) {
      throw new HttpError(message, 400);
    }

    const hashedNewPassword = await hash(password, 12);
    user.password = hashedNewPassword;
    user.token_version = user.token_version ? user.token_version + 1 : 1;
    await user.save();
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};

export const updateProfile = async (userId: string, profileUpdates: any) => {
  try {
    const user = await UserModel.findById(userId);
    let needsReverification = false;
    if (!user) {
      throw new HttpError("User not found.", 404);
    }

    if (profileUpdates.hasOwnProperty("name")) user.name = profileUpdates.name;
    if (profileUpdates.hasOwnProperty("email"))
      user.email = profileUpdates.email;
    if (profileUpdates.hasOwnProperty("city")) user.city = profileUpdates.city;
    if (profileUpdates.hasOwnProperty("country"))
      user.country = profileUpdates.country;
    if (profileUpdates.hasOwnProperty("region"))
      user.region = profileUpdates.region;
    if (profileUpdates.hasOwnProperty("education"))
      user.education = profileUpdates.education;
    if (profileUpdates.hasOwnProperty("school"))
      user.school = profileUpdates.school;

    if (user.isModified("email")) {
      if (!emailPattern.test(user.email)) {
        throw new HttpError("Invalid email format.", 400);
      }
      user.is_email_verified = false;
      user.email_verification_token = crypto.randomBytes(20).toString("hex");
      sendVerificationEmail(user.email, user.email_verification_token);
      needsReverification = true;
      //Frontend needs to inform user to re-verify email
    }

    // FIXME: You're sending back the entire user including the _id, __v, everything. You need to just send back the UserCredentials. So, what you should do is make a util or something that 
    // forms the correct object just like you were doing from the login. Or you can .clone() the findById query and use projection.
    await user.save();

    const updatedUser: any = user.toObject();
    delete updatedUser.password;
    delete updatedUser.emailVerificationToken;
    delete updatedUser.resetPasswordToken;

    return [updatedUser, needsReverification];
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};

export const deleteUser = async (email: string) => {
  try {
    const user = await UserModel.findOneAndDelete({ email });
    if (!user) {
      throw new HttpError("User not found.", 404);
    }
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};
