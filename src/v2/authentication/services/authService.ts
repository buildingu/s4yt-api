import User from "../../typings/User";

import nodemailer from "nodemailer";
import { hash } from "bcrypt";

export const getUsers = async () => {
    try {
      return null;
    } catch (error: any) {
      throw new Error(
        "getUsers service error; fetching all users:\n" + error.message
      );
    }
  },
  getUser = async (email: string) => {
    try {
      return null;
    } catch (error: any) {
      throw new Error(
        "getUser service error; fetching the user:\n" + error.message
      );
    }
  };

export const register = async (user: User) => {
    try {
      user.password = await hash(user.password, 12);
      return null;
    } catch (error: any) {
      throw new Error(
        "register service error; adding the user:\n" + error.message
      );
    }
  },
  emailVerify = async (email: string) => {
    try {
      return null;
    } catch (error: any) {
      throw new Error(
        "emailVerify service error; sending verification email:\n" +
          error.message
      );
    }
  };

// UserLoginDto
export const login = async (user: any) => {
  try {
    return null;
  } catch (error: any) {
    throw new Error(
      "login service error; creating user token:\n" + error.message
    );
  }
};

export const sendResetPasswordEmail = async (email: string) => {
    try {
      return null;
    } catch (error: any) {
      throw new Error(
        "sendResetPasswordEmail service error; sending reset email:\n" +
          error.message
      );
    }
  },
  // resetPassword = async ({ email, password }: resetPasswordDto) => {
  //   try {
  //     return null;
  //   } catch (error: any) {
  //     throw new Error(
  //       "register service error; caching the user into Redis:\n" + error.message
  //     );
  //   }
  // },
  updatePassword = async (email: string) => {
    try {
      return null;
    } catch (error: any) {
      throw new Error(
        "register service error; caching the user into Redis:\n" + error.message
      );
    }
  };

export const updateProfile = async (email: Omit<User, "password">) => {
    try {
      return null;
    } catch (error: any) {
      throw new Error(
        "updateProfile service error; updating the user credentials:\n" +
          error.message
      );
    }
  },
  sendReferrals = async () => {
    try {
      return null;
    } catch (error: any) {
      throw new Error(
        "sendReferrals service error; sending referral history:\n" +
          error.message
      );
    }
  };

export const deleteUser = async (email: string) => {
  if (!email) return false;
  try {
    return null;
  } catch (error: any) {
    throw new Error(
      "deleteUser service error; deleting the the user:\n" + error.message
    );
  }
};
