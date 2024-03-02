import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import User from "../../typings/User";

export interface CustomJwtPayload extends JwtPayload {
  userId?: string;
}

// Then, inside the declare module block
declare module "express-serve-static-core" {
  interface Request {
    decodedClaims?: CustomJwtPayload;
    user?: User;
  }
}