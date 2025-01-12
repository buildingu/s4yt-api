import { Request } from "express";

export interface locationDTO extends Request {
  body: string;
}
