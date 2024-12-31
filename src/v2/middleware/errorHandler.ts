import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

// This can be used as a middleware thought instead of called next for the catch error in the controllers, so it doesn't send the default node server error, but that is fine.
const errorHandler = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const err: any = error;

  if (
    err.statusCode === 500 ||
    err.message?.toLowerCase().includes("unexpectedly") ||
    !err.statusCode
  ) {
    logger.error(err.stack || err);
  }
  
  return res.status(err.statusCode || 500).json({
      message: err.message
  });
};

export default errorHandler;
