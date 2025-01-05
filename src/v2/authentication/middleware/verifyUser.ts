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
    if (req.path.includes("/email/verify")) {
      const token = req.query.token as string;
      if (!token) {
        return res
          .status(400)
          .json({ message: "Verification token is missing." });
      }
      const user = await verifyEmail(token);
      if (user === null) {
        // Check for null explicitly
        return res
          .status(401)
          .json({ message: "User not found or token invalid." });
      }
      req.user = user;
      return next();
    } else if (req.path.includes("/password")) {
      // Handle password reset token verification
      const token = req.body.token;
      if (!token) {
        return res.status(400).json({ message: "Reset token is missing." });
      }
      const user = await UserModel.findOne({ resetPasswordToken: token });
      if (!user) {
        return res.status(401).json({ message: "Invalid or expired reset token." });
      }
      // You might want to check if the token is expired here as well
      req.user = user;
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
