import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { hash } from "bcrypt";

export const initializeCsrfToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const csrfToken = randomUUID();

    // Another approach would be to store the token in Redis and compare it instead of storing it in a cookie.
    return res
      .cookie("XSRF-TOKEN", csrfToken, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({
        message: "CSRF token successfully created.",
        token: await hash(csrfToken, 12), // This is hashed here because tokens should not be in the body, we would decrypt this one somehow and send it in the headers because I don't know how to get the value from the cookie lol, don't think you can.
      });
  } catch (error: any) {
    error.reason = "failed to initialize token";
    next(error);
  }
};
