import UserModel from "../../models/user";
import User from "../../typings/User";
import UserCredentials from "../../typings/UserCredentials";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail, sendResetPasswordEmail } from "../services/emailService";
import { HttpError } from "../../middleware/errorHandler";
import { isoTimestamps } from "../../configs/timestamps";
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
  } catch (error: any) {
    throw new HttpError(
      "CSRF service error; " + error.message,
      500
    );
  }
};

export const getUsers = async () => {
  try {
    const users = await UserModel.find();
    return users;
  } catch (error: any) {
    throw new HttpError(
      "getUsers service error; " + error.message,
      500
    );
  }
};

export const getUser = async (email: string) => {
  try {
    const user = await UserModel.findOne({ email });
    return user;
  } catch (error: any) {
    throw new HttpError(
      "getUser service error; " + error.message,
      500
    );
  }
};

export const validatePassword = (password: string) => {
  if (password.length < passwordMinLength || password.length > passwordMaxLength) {
    return {
      valid: false,
      message: `Password must be between ${passwordMinLength} and ${passwordMaxLength} characters.`,
    };
  }

  if (!passwordPattern.test(password)) {
    return {
      valid: false,
      message:
        "Password must contain at least one number, one lowercase and one uppercase letter, and one special character.",
    };
  }

  return { valid: true, message: "Password is valid." };
};

export const register = async (userData: any) => {
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
    coin: userData.coin || 50,
    referer_code: userData.refererCode || refererCode, 
    used_refer_code: userData.usedReferCode || false,
    is_email_verified: false,
    email_verification_token: crypto.randomBytes(20).toString("hex"),
  });

  await newUser.save();

  if (process.env.SEND_EMAILS === 'true') {
    sendVerificationEmail(newUser.email, newUser.email_verification_token);
  }

  return newUser;
};

export const resendVerificationEmail = async () => {
  const user = await UserModel.findOne();
  if (!user) {
    throw new HttpError("User does not exist.", 401);
  } else if (!user.email_verification_token) {
    throw new HttpError("User is already verified.", 204);
  }
  sendVerificationEmail(user.email, user.email_verification_token);
}

export const login = async (loginData: { email: string; password: string }) => {
  const user = await UserModel.findOne({ email: loginData.email });
  if (!user) {
    throw new HttpError("User does not exist.", 401); // This is 404, but ignore me if you want.
  } else if (!user.is_email_verified) {
    // FIXME: You're checking this before you see if it's the correct password. I can put in the wrong password and see this message, put this verified message below the password isMatch.
    // This should be already checked by verifyUser (You're not using that middleware for the login btw and probably shouldn't anyways).
    throw new HttpError(
      "Email is not verified. Please check your email to verify your account. If you lost your verification link, press Resend Verification Email above to get a new link.",
      401
    );
  }

  const isMatch = await compare(loginData.password, user.password);
  if (!isMatch) {
    throw new HttpError("Invalid credentials.", 401);
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
};

export const verifyEmail = async (token: string): Promise<User | null> => {
  const user = await UserModel.findOne({ emailVerificationToken: token });
  if (!user) {
    throw new HttpError("User not found.", 401);
  }

  user.is_email_verified = true;
  user.email_verification_token = undefined!;
  await user.save();
  return user;
};

export const initiatePasswordReset = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new HttpError("User not found.", 401);
  }
  
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.reset_password_token = resetToken;
  await user.save();

  if (process.env.SEND_EMAILS === 'true') {
    await sendResetPasswordEmail(email, resetToken);
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await UserModel.findOne({ resetPasswordToken: token });
  if (!user) {
    throw new HttpError("Invalid or expired password reset token.", 401);
  }

  const hashedPassword = await hash(newPassword, 12);
  user.password = hashedPassword;
  user.reset_password_token = undefined!;
  await user.save();

  return user;
};

export const updatePassword = async (userId: string, oldPassword: string, newPassword: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new HttpError("User not found.", 401);
  }

  const isMatch = await compare(oldPassword, user.password);
  if (!isMatch) {
    throw new HttpError("Invalid credentials.", 401);
  }

  const hashedNewPassword = await hash(newPassword, 12);
  user.password = hashedNewPassword;
  user.token_version = user.token_version ? user.token_version + 1 : 1;
  await user.save();

  return true;
};

export const updateProfile = async (userId: string, profileUpdates: any) => {
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
    throw new HttpError("Invalid email.", 400);
  }

  await user.save();

  const updatedUser: any = user.toObject();
  delete updatedUser.password;
  delete updatedUser.emailVerificationToken;
  delete updatedUser.resetPasswordToken;

  return updatedUser;
};

export const sendReferrals = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new HttpError("User not found.", 401);
  }

  // const referrals = user.referrals;

  return null;
};

export const deleteUser = async (email: string) => {
  const user = await UserModel.findOneAndDelete({ email });
  if (!user) {
    throw new HttpError(`No user found with email: ${email}`, 401);
  }
  return user;
};
