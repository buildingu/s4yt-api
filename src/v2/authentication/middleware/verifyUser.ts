import { Request, Response, NextFunction } from "express";
import User from "../../typings/User";

import { getUser } from "../services/authService";

// This is used on the login route to verify the credentials that was passed in the req.body and maybe somehow in the email reset email and the password reset email.
// So do the incorrect email and incorrect password responses here.
const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const user = (await getUser(req.body.email, true)) as User;

    // req.authUser = decodedClaims;
    console.log("User successfully verified.");
    next();
  } catch (error) {
    console.error(error);
  }
};

export default verifyUser;
