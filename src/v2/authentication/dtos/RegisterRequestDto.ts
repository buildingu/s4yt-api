import { Request } from "express";
import User from "../../typings/User";

export default interface RegisterRequestDto extends Request {
  body: User;
}
