import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { ErrorPatternCheck } from "../typings/ErrorPatternCheck";
export class HttpError extends Error {
  public statusCode: number;
 
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
}

// Use this function in the catch blocks of service functions to automatically forward HttpErrors to the corresponding controller
//
// You can optionally pass an array of ErrorPatternCheckd to the second paramter to examine error.name and throw a custom HttpError
// for the first one that matches. This is most for handling errors thrown from Mongoose.
export const serviceErrorHandler = (error: unknown, errorPatternChecks?: ErrorPatternCheck[]): HttpError => {
  if (error instanceof HttpError) {
    return error;
  }

  const err = error as Error;

  if (errorPatternChecks) {
    for (const check of errorPatternChecks) {
      if (err.name === check.errorName) {
        return new HttpError(check.errorMessage, check.httpStatusCode);
      }
    }
  }

  return new HttpError("An unexpected error occurred.", 500);
}

// This can be used as a middleware thought instead of called next for the catch error in the controllers, so it doesn't send the default node server error, but that is fine.
export const routeErrorHandler = async (
  error: HttpError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const err: any = error;

  if (
    err.statusCode === 500 ||
    !err.statusCode
  ) {
    logger.error(err.stack || err);
  }
  
  return res.status(err.statusCode || 500).json({
      message: err.message
  });
};
