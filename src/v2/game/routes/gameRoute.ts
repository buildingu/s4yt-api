import { Router } from "express";
import * as verifyTokens from "../../authentication/middleware/verifyTokens";
import verifyCsrfToken from "../../csrf/middleware/verifyCsrfToken";
import * as gameController from "../controllers/gameController";
import { verify } from "crypto";

const router = Router();

router.get('/treasure-map', verifyTokens.verifyAccessToken, gameController.getTreasureMap);
router.get("/chests", verifyCsrfToken, verifyTokens.verifyAccessToken, gameController.getChests);

router.get("/businesses", verifyTokens.verifyAccessToken, gameController.sendBusinessesInfo);
router.post("/businesses/:businessId/player/meet-ups", verifyCsrfToken, verifyTokens.verifyAccessToken, gameController.addMeetUp); // This is how we'll submit the meetup submissions from whatever the player chooses (yes or maybe is all it is).
router.get("/businesses/winners", verifyTokens.verifyAccessToken, gameController.sendBusinessChallengeWinners); // Challenge winners would be inputted in the admin panel I think.

router.post("/questions/:questionId", verifyCsrfToken, verifyTokens.verifyAccessToken, gameController.saveAnswer);
router.patch("/answers/:answerId", verifyCsrfToken, verifyTokens.verifyAccessToken, gameController.updateAnswer);

router.get("/raffle", verifyTokens.verifyAccessToken, gameController.sendRaffleInfo); // Sends us the raffle items and stuff.
router.get("/raffle/coins", verifyTokens.verifyAccessToken, gameController.sendRaffleIndicatorCoins); // This gives use the gold and sliver coins, which is the gold coin means someone placed a coin(s) on that raffle item and the sliver coins means none.
// *There is a socket to listen for the placement of coins on items so we can update in real-time.*
router.get("/raffle/winners", verifyTokens.verifyAccessToken, gameController.sendRaffleWinners); // To do this you'll create a randomizer with better odds for someone with more coins added to that item and find the winner for each raffle item I think or do it whatever way you like.

router.post("/player/coins/chest", verifyCsrfToken, verifyTokens.verifyAccessToken, gameController.addChestCoins); // This is for awarding coins to the player earned from chests in "Learn and Earn"
router.get("/player/coins/history", verifyTokens.verifyAccessToken, gameController.sendCoinsGainedHistory); // You have to keep track of how the coins were gained (referral, quiz, or whatever) and just send use the type(where it was from) and the coins.
router.get("/player/coins/total", verifyTokens.verifyAccessToken, gameController.sendCoinsTotal);
router.get("/results", verifyTokens.verifyAccessToken, gameController.displayEventResults);

router.post('/raffle/partners', verifyTokens.verifyAccessToken, gameController.addPartner);
router.patch('/raffle/partners/:id', verifyTokens.verifyAccessToken, gameController.updatePartner); 
router.get('/raffle/partners', verifyTokens.verifyAccessToken, gameController.getRafflePartners);
router.get('/raffle/partners/:id', verifyTokens.verifyAccessToken, gameController.getRafflePartner);
export default router;
