import { Request, Response, NextFunction } from "express";

// You can use this if you want for sending errors. The errors where sent in a array last time like: {errors: []}.
// This is actually a util lol, so put it in a util folder.
const errorHandler = async () => {};

// This can be used as a middleware thought instead of called next for the catch error in the controllers, so it doesn't send the default node server error, but that is fine.
// const errorHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};

export default errorHandler;
