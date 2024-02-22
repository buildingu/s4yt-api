import { Request, Response, NextFunction } from "express";
import User from "../typings/User";

const lowercaseEmails = (
  req: Request<{}, {}, User>,
  res: Response,
  next: NextFunction
) => {
  req.body.email && (req.body.email = req.body.email.toLowerCase()); // Just so all emails are consistent.
  next();
};

export default lowercaseEmails;
