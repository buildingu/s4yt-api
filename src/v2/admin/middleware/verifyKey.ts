import { Request, Response, NextFunction } from "express";
import ApiKey from "../../models/apiKeys";

export const verifyApiKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const apiKey = req.headers["x-api-key"] as string;
  
      if (!apiKey) {
        return res.status(401).json({ message: "API key is required" });
      }
  
      const keyRecord = await ApiKey.findOne({ key: apiKey, active: true });
  
      if (!keyRecord) {
        return res.status(403).json({ message: "Invalid or inactive API key" });
      }
  
      await ApiKey.updateOne({ key: apiKey }, { lastUsedAt: new Date() });
  
      next(); 
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
  };
