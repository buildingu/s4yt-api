import UserModel from "../../models/user";
import User from "../../typings/User";
import UserCredentials from "../../typings/UserCredentials";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail, sendResetPasswordEmail } from "../services/emailService";
import { HttpError, resolveErrorHandler } from "../../middleware/errorHandler";
import { isoTimestamps } from "../../configs/timestamps";
import { trackCoins } from "../../utils/coinLogger";
import { HydratedDocument } from "mongoose";
const { sign } = jwt;

const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordMinLength = 8;
const passwordMaxLength = 32;
const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,32}$/;

const registerStartTimeMs = new Date(isoTimestamps.register_start).getTime();

export const csrf = async () => {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    return token;
  } catch (error) {
    throw new HttpError("Error generating CSRF token.", 500);
  }
};

export const getUsers = async () => {
  try {
    const users = await UserModel.find();
    return users;
  } catch (error) {
    throw new HttpError("Error fetching users.", 500);
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
  if (password.length < passwordMinLength || password.length > passwordMaxLength) {
    return {
      valid: false,
      message: `password must be between ${passwordMinLength} and ${passwordMaxLength} characters`,
    };
  }

  if (!passwordPattern.test(password)) {
    return {
      valid: false,
      message:
        "password must contain at least one number, one lowercase and one uppercase letter, and one special character",
    };
  }

  return { valid: true, message: "password is valid" };
};

const awardRegistrationCoins = (user: HydratedDocument<User>, amount: number) => {
  user.coins += amount;
  trackCoins(user, amount, 'register', false);
}

export const register = async (userData: any) => {
  try {
    if (!emailPattern.test(userData.email)) {
      throw new HttpError("Invalid email or password.", 400);
    }

    const existingUser = await getUser(userData.email);
    if (existingUser) {
      throw new HttpError("Invalid email or password.", 400); 
    }

    const { valid, message } = validatePassword(userData.password);
    if (!valid) {
      throw new HttpError(message, 400); 
    }

    const hashedPassword = await hash(userData.password, 12);
    
    const refererCode = crypto.randomBytes(10).toString('hex');

    const newUser = new UserModel({
      ...userData,
      password: hashedPassword,
      role: userData.role || 'Player',
      coin: userData.coin || 0,
      referer_code: userData.refererCode || refererCode, 
      used_refer_code: userData.usedReferCode || false,
      is_email_verified: false,
      email_verification_token: crypto.randomBytes(20).toString("hex"),
    });

    awardRegistrationCoins(newUser, 50);
    await newUser.save();

    if (process.env.SEND_EMAILS === 'true') {
      sendVerificationEmail(newUser.email, newUser.email_verification_token);
    }

    return newUser;
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};

export const resendVerificationEmail = async (email: string) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new HttpError("User does not exist.", 404);
    } else if (!user.email_verification_token) {
      throw new HttpError("User is already verified.", 204);
    }
    sendVerificationEmail(user.email, user.email_verification_token);
  } catch (error) {
    throw resolveErrorHandler(error);
  }
}

export const login = async (loginData: { email: string; password: string }) => {
  try {
    const user = await UserModel.findOne({ email: loginData.email });
    if (!user) {
      throw new HttpError("User does not exist.", 404);
    }
    
    const isMatch = await compare(loginData.password, user.password);
    if (!isMatch) {
      throw new HttpError("Invalid credentials.", 401);
    }

    if (!user.is_email_verified) {
      throw new HttpError(
        "Email is not verified. Please check your email to verify your account. If you lost your verification link, press Resend Verification Email above to get a new link.",
        401
      );
    }

    const userCredentials: UserCredentials = {
      id: user._id.toString(),
      city: user.city || null,
      country: user.country || '',
      education: user.education || null,
      email: user.email,
      name: user.name || '',
      quiz_submitted: user.quiz_submitted,
      referral_link: user.referral_link,
      region: user.region || null,
      roles: user.role || null,
      school: user.school || null,
    };

    const jwtToken = sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const csrfToken = crypto.randomBytes(32).toString("hex");

    // If game or registration has started, send timestamps, otherwise send "not started" message
    const resTimestamps = registerStartTimeMs > Date.now()
      ? "The game has not started yet"
      : isoTimestamps;

    return {
      user: userCredentials,
      timestamps: resTimestamps,
      jwtToken,
      csrfToken
    };
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};

export const verifyEmail = async (token: string) => {
  try {
    const user = await UserModel.findOne({ emailVerificationToken: token });
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
    
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.reset_password_token = resetToken;
    await user.save();

    if (process.env.SEND_EMAILS === 'true') {
      await sendResetPasswordEmail(email, resetToken);
    }
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const user = await UserModel.findOne({ resetPasswordToken: token });
    if (!user) {
      throw new HttpError("Invalid or expired password reset token.", 401);
    }

    const hashedPassword = await hash(newPassword, 12);
    user.password = hashedPassword;
    user.reset_password_token = undefined!;
    await user.save();
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};

export const updatePassword = async (userId: string, oldPassword: string, newPassword: string) => {
  try {
    if (!oldPassword) {
      throw new HttpError("Current password is missing.", 400);
    }

    if (!newPassword) {
      throw new HttpError("New password is missing.", 400);
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new HttpError("User not found.", 404);
    }

    const isMatch = await compare(oldPassword, user.password);
    if (!isMatch) {
      throw new HttpError("Invalid credentials.", 401);
    }

    const hashedNewPassword = await hash(newPassword, 12);
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

    if (!user) {
      throw new HttpError("User not found.", 401);
    }

    if (profileUpdates.hasOwnProperty('name')) user.name = profileUpdates.name;
    if (profileUpdates.hasOwnProperty('email')) user.email = profileUpdates.email;
    if (profileUpdates.hasOwnProperty('city')) user.city = profileUpdates.city;
    if (profileUpdates.hasOwnProperty('country')) user.country = profileUpdates.country;
    if (profileUpdates.hasOwnProperty('region')) user.region = profileUpdates.region;
    if (profileUpdates.hasOwnProperty('education')) user.education = profileUpdates.education;
    if (profileUpdates.hasOwnProperty('school')) user.school = profileUpdates.school;

    if (user.isModified('email') && !emailPattern.test(user.email)) {
      throw new HttpError("Invalid email format.", 400);
    }

    await user.save();

    const updatedUser: any = user.toObject();
    delete updatedUser.password;
    delete updatedUser.emailVerificationToken;
    delete updatedUser.resetPasswordToken;

    return updatedUser;
  } catch (error) {
    throw resolveErrorHandler(error);
  }
};

export const sendReferrals = async (userId: string) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new HttpError("User not found.", 404);
    }

    // const referrals = user.referrals;

    return null;
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
