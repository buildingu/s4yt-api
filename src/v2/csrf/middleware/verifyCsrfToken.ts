import { Request, Response, NextFunction } from "express";

const verifyCsrfToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const storedToken = req.cookies["XSRF-TOKEN"],
    receivedToken = req.headers["x-xsrf-token"];

  console.log("Stored CSRF token:", storedToken);
  console.log("Received CSRF token:", receivedToken);
  if (!storedToken || !receivedToken) {
    return res.status(403).json({
      ERROR: "CSRF token is missing.",
    });
  }

  if (storedToken !== receivedToken) {
    return res.status(403).json({
      ERROR: "CSRF token does not match.",
    });
  }

  console.log("CSRF token successfully verified.");
  next();
};

export default verifyCsrfToken;
