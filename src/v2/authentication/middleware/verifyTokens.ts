import { Request, Response, NextFunction } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers.authorization?.split("Bearer ")[1];
  // console.log("accessToken", accessToken);

  if (!accessToken) {
    return res.status(401).json({
      message: "Access token is missing.",
    });
  }

  try {
    const decodedClaims = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    // console.log("decodedClaims", decodedClaims);
    // Check if the token is expired, in milliseconds.
    if (Date.now() >= decodedClaims.exp! * 1000) {
      return res.status(403).json({
        message: "Access token is expired.",
      });
    }

    // @ts-ignore | I had to put this here because I have no idea why actually, it would give the shitty default error and not tell me why until I put ts-ignore here.
    req.decodedClaims = decodedClaims; // If you want to use any field from the token somewhere.
    console.log("Access token successfully verified.");
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({
      message: "Access token is invalid.",
    });
  }
};
