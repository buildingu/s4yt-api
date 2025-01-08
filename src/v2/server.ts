/* s4yt-api Version 2
 *
 * @App Creation Date: February 22st, 2024
 * @Last Updated: February 22st, 2024
 *
 * @Author Krzysztof Garbos
 * @contributors David Bishop, Krzysztof Garbos
 *
 * @Description This is the special event/'game', called Dollars for Your Thoughts ($4YT), back-end REST API for Building-u.
 */

import express from "express";
import { createServer } from 'node:http';
import dotenv from "dotenv";
// import { redisClient } from "./configs/redisConfig";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";

import connectDB from "./db/db";
import { setupSockets } from "./sockets/sockets";
import lowercaseEmails from "./middleware/lowercaseEmails";
import errorHandler from "./middleware/errorHandler";
import { setupLogger } from "./utils/logger";

import adminRouter from "./admin/routes/admRoute";
import authRouter from "./authentication/routes/authRoute";
import csrfRouter from "./csrf/routes/csrfRoute";
import gameRouter from "./game/routes/gameRoute";
import busRouter from "./business/routes/busRoute";
dotenv.config();

// Set up server (HTTP + sockets)
const app = express();
const server = createServer(app);
setupSockets(server);

// Connect DB
connectDB();

const PORT = Number(process.env.PORT) || 4000,
  baseUrl = "/api/v2";

// (async () => {
//   let retries = 5;

//   while (retries) {
//     try {
//       await redisClient.connect();
//       break;
//     } catch (error) {
//       console.log(error);

//       retries -= 1;
//       console.log(
//         `Redis connection failed. Retrying connection; ${retries} retries left.`
//       );
//       await new Promise((resolve) => setTimeout(resolve, 5000));
//     }
//   }
// })();

// **Middleware**
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      // "https://s4yt-staging.building-u.com", - don't know yet.
      "https://s4yt.org",
    ], // I don't remember what the staging url looks like, I think that's it.
    credentials: true,
    exposedHeaders: ["Authorization", "x-xsrf-token"] // Yeah this does look weird, but I had to do that so I can get values on the front. You only send these headers on login, so it's alright or you can send the tokens in the body, don't matter.
  })
);

// *Security*
app.use(helmet()); // Protects various HTTP headers that can help defend against common web hacks.
app.use(hpp()); // Protects against HTTP Parameter Pollution attacks.

// Rate-limiting - used to limit repeated requests. CHANGE THIS MAYBE?
app.use((req, res, next) => {
  rateLimit({
    windowMs: 60 * 60 * 1000, // 60 Minutes
    max: 55, // limit each IP to 55 requests per windowMs.
    message:
      "Too many requests made from this IP, please try again after an hour.",
  })(req, res, next);
});

// Request logger.
setupLogger(app);

// *Custom*
app.use(lowercaseEmails);

// *Router*
app.use(`${baseUrl}/admin`, adminRouter);
app.use(`${baseUrl}/auth`, authRouter);
app.use(`${baseUrl}/csrf`, csrfRouter);
app.use(`${baseUrl}/game`, gameRouter);
app.use(`${baseUrl}/business`, busRouter);
app.use(errorHandler);

server.listen(PORT, process.env.HOST as string, () =>
  console.log(
    `Server is running on ${process.env.PROTOCOL}${process.env.HOST}:${PORT}; Ctrl-C to terminate...`
  )
);
