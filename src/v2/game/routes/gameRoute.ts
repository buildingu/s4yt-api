import { Router } from "express";
import verifyCsrfToken from "../../csrf/middleware/verifyCsrfToken";
import { verifyAccessToken } from "../../authentication/middleware/verifyTokens";
import * as gameController from "../controllers/gameController";

const router = Router();

router.post("/challenges", verifyCsrfToken, verifyAccessToken, gameController.saveAnswer);
router.patch("/meetup", verifyCsrfToken, verifyAccessToken, gameController.rsvpMeetUp); // This is how we'll submit the meetup submissions from whatever the player chooses (yes or maybe is all it is).
router.get("/results", verifyCsrfToken, verifyAccessToken, gameController.displayEventResults);

router.get("/chests", verifyCsrfToken, verifyAccessToken, gameController.getChests);
router.post("/player/coins/chest", verifyCsrfToken, verifyAccessToken, gameController.addChestCoins); // This is for awarding coins to the player earned from chests in "Learn and Earn"
router.get("/player/coins/history", verifyCsrfToken, verifyAccessToken, gameController.sendCoinsGainedHistory); // You have to keep track of how the coins were gained (referral, quiz, or whatever) and just send use the type(where it was from) and the coins.
router.get("/player/coins/total", verifyCsrfToken, verifyAccessToken, gameController.sendCoinsTotal);

router.get("/raffle/items", verifyCsrfToken, verifyAccessToken, gameController.getRaffleItemsTransformed);
router.post("/raffle/items", verifyCsrfToken, verifyAccessToken, gameController.updateStakedCoins);
router.get('/raffle/winners/fetch', verifyCsrfToken, verifyAccessToken, gameController.sendRaffleWinners);

export default router;
