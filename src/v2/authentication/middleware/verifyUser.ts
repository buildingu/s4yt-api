import { Request, Response, NextFunction } from "express";
import { getUser, verifyEmail } from "../services/authService";
import User from "../../typings/User";
import UserModel from "../../models/user";

interface AuthRequest extends Request {
  user?: User;
}

const verifyUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.path.includes("/email/verify") || req.path.includes("/password")) {
      // Email verification and pasword updates are handled by the auth service.
      return next();
    } else {
      const email = req.body.email;
      const user = await getUser(email);
      if (!user) {
        return res.status(401).json({ message: "User not found." });
      }
      if (!user.is_email_verified) {
        return res
          .status(401)
          .json({ message: "Email is not verified. Please check your email to verify your account. If you lost your verification link, press Resend Verification Email above to get a new link.", });
      }
      req.user = user;
      next();
    }
  } catch (error) {
    next(error);
  }
};

export default verifyUser;
