import { Request, Response, NextFunction } from "express";
import { timingSafeEqual } from "crypto";

const verifyCsrfToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const storedToken = req.cookies["XSRF-TOKEN"],
    receivedToken = Array.isArray(req.headers["x-xsrf-token"]) ? req.headers["x-xsrf-token"][0] : req.headers["x-xsrf-token"];

  //console.log("Stored CSRF token:", storedToken);
  //console.log("Received CSRF token:", receivedToken);
  if (!storedToken || !receivedToken) {
    return res.status(403).json({
      ERROR: "CSRF token is missing.",
    });
  }

  // Convert to Buffers for a timing-safe comparison
  const bufferStoredToken = Buffer.from(storedToken);
  const bufferReceivedToken = Buffer.from(receivedToken, 'utf8');

  // Ensure both Buffers are of equal length
  if (bufferStoredToken.length !== bufferReceivedToken.length) {
    return res.status(403).json({
      ERROR: "CSRF token does not match.",
    });
  }

  // Use timingSafeEqual for comparison
  if (!timingSafeEqual(bufferStoredToken, bufferReceivedToken)) {
    return res.status(403).json({
      ERROR: "CSRF token does not match.",
    });
  }

  console.log("CSRF token successfully verified.");
  next();
};

export default verifyCsrfToken;