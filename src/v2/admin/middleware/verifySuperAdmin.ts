import { Request, Response, NextFunction } from 'express';
import { CustomJwtPayload } from '../../typings/express/Request';
import UserModel from '../../models/user';

const verifySuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.decodedClaims as CustomJwtPayload)?.userId;

  if (!userId) {
    res.status(403).json({ message: "Access denied. This action requires Super Admin privileges." });
  }

  const user = await UserModel.findById(userId, 'role');
  if (!user) {
    res.status(403).json({ message: "Access denied. This action requires Super Admin privileges." });
  }

  if (user?.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. This action requires Super Admin privileges." });
  }
};

export default verifySuperAdmin;