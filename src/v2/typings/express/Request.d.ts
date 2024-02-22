import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    // extend the request body or whatever here.
    decodedClaims?: JwtPayload;
    // authUser?: GetUserDto;
  }
}
