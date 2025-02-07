import { Request, Response, NextFunction } from 'express';

const verifySuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. This action requires Super Admin privileges." });
  }
};

export default verifySuperAdmin;