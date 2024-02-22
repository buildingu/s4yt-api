import { sign } from "jsonwebtoken";

// Could use their id instead of email, id is probably better.
export class GenerateJWT {
  accessToken(email: string) {
    try {
      return sign({ sub: email }, process.env.ACCESS_TOKEN_SECRET as string, {
        algorithm: "HS256",
        // expiresIn: "15m", // We won't need a expires, but we can impalement it if you want to be more secure, but what we had was
        // they log in and they can be logged in for forever only until the next period starts; register_start, game_start, etc. You don't need to
        // do anything when the next period starts, we can just call the logout endpoint when a new period starts, we keep track of the times on the front-end.
        //
        // You can find these periods in src/redux/reducers/gameConfig in the front-end or find them in the back-end somewhere because you
        // will be sending up these timestamps from whatever Tamera or whoever inputs in the admin panel. So, just send us the timestamps in the game
        // folder somewhere and you do have to disable the login and register if it's before register_start, I think that's all you need to do with that.
      });
    } catch (error: any) {
      throw new Error("JWT error; generating access token:\n" + error.message);
    }
  }
}
