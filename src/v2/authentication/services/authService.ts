import UserModel from "../../models/user";
import User from "../../typings/User";
import nodemailer from "nodemailer";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail, sendResetPasswordEmail } from "../services/emailService";
const { sign } = jwt;

export const csrf = async () => {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    return token;
  } catch (error: any) {
    throw new Error(
      "CSRF service error; generating CSRF token:\n" + error.message
    );
  }
};

export const getUsers = async () => {
  try {
    const users = await UserModel.find();
    return users;
  } catch (error: any) {
    throw new Error(
      "getUsers service error; fetching all users:\n" + error.message
    );
  }
};

export const getUser = async (email: string) => {
  try {
    const user = await UserModel.findOne({ email });
    return user;
  } catch (error: any) {
    throw new Error(
      "getUser service error; fetching the user:\n" + error.message
    );
  }
};

export const validatePassword = (password: string) => {
  const minLength = 8;
  const maxLength = 32;
  const regex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,32}$/;

  if (password.length < minLength || password.length > maxLength) {
    return {
      valid: false,
      message: `Password must be between ${minLength} and ${maxLength} characters.`,
    };
  }

  if (!regex.test(password)) {
    return {
      valid: false,
      message:
        "Password must contain at least one number, one lowercase and one uppercase letter, and one special character.",
    };
  }

  return { valid: true, message: "Password is valid." };
};

export const register = async (userData: any) => {
  try {
    const existingUser = await getUser(userData.email);
    if (existingUser) {
      throw new Error("User already exists with this email.");
    }

    const { valid, message } = validatePassword(userData.password);
    if (!valid) {
      throw new Error(message);
    }

    const hashedPassword = await hash(userData.password, 12);

    const newUser = new UserModel({
      ...userData,
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationToken: crypto.randomBytes(20).toString("hex"),
    });
    await newUser.save();

    sendVerificationEmail(newUser.email, newUser.emailVerificationToken);

    return newUser;
  } catch (error: any) {
    throw new Error("register service error; " + error.message);
  }
};

export const login = async (loginData: { email: string; password: string }) => {
  try {
    const user = await UserModel.findOne({ email: loginData.email });
    if (!user) {
      throw new Error("User does not exist");
    } else if (!user.isEmailVerified) {
      throw new Error(
        "Email is not verified. Please check your email to verify your account."
      );
    }

    const isMatch = await compare(loginData.password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const userWithoutPassword = {
      ...user.toObject(),
      password: undefined,
    };

    const token = sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return { user: userWithoutPassword, token };
  } catch (error: any) {
    throw new Error("login service error; " + error.message);
  }
};

export const verifyEmail = async (token: string): Promise<User | null> => {
  const user = await UserModel.findOne({ emailVerificationToken: token });
  if (!user) {
    return null; // Explicitly return null if no user is found
  }
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined!;
  await user.save();
  return user;
};

export const initiatePasswordReset = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("User not found.");
  }
  
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = resetToken;
  await user.save();

  await sendResetPasswordEmail(email, resetToken);
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await UserModel.findOne({ resetPasswordToken: token });
  if (!user) {
    throw new Error("Invalid or expired password reset token.");
  }

  const hashedPassword = await hash(newPassword, 12);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined!;
  await user.save();
};

export const updatePassword = async (userId: string, newPassword: string) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    const hashedPassword = await hash(newPassword, 12);
    user.password = hashedPassword;
    
    await user.save();

    user.tokenVersion = user.tokenVersion ? user.tokenVersion + 1 : 1;
    await user.save();

    return true;
  } catch (error: any) {
    throw new Error("updatePassword service error; " + error.message);
  }
};

// export const updateProfile = async (email: Omit<User, "password">) => {
//     try {
//       return null;
//     } catch (error: any) {
//       throw new Error(
//         "updateProfile service error; updating the user credentials:\n" +
//           error.message
//       );
//     }
//   },
//   sendReferrals = async () => {
//     try {
//       return null;
//     } catch (error: any) {
//       throw new Error(
//         "sendReferrals service error; sending referral history:\n" +
//           error.message
//       );
//     }
//   };

export const deleteUser = async (email: string) => {
  try {
    const user = await UserModel.findOneAndDelete({ email });
    if (!user) {
      throw new Error(`No user found with email: ${email}`);
    }
    return user;
  } catch (error: any) {
    throw new Error(
      `deleteUser service error; deleting the user: ${error.message}`
    );
  }
};
