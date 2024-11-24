import { Router } from "express";
import * as verifyTokens from "../../authentication/middleware/verifyTokens";
import verifyCsrfToken from "../../csrf/middleware/verifyCsrfToken";
import * as gameController from "../controllers/gameController";
import { verify } from "crypto";

const router = Router();

router.get("/instructions", verifyTokens.verifyAccessToken, gameController.sendInstructions);
router.get('/treasure-map', verifyTokens.verifyAccessToken, gameController.getTreasureMap);

router.post('/sponsors', verifyCsrfToken, verifyTokens.verifyAccessToken, gameController.addSponsor);
router.post('/sponsors/:sponsorId', verifyCsrfToken, verifyTokens.verifyAccessToken, gameController.addMultipleChoice)
router.put('/sponsors/:id', verifyCsrfToken, verifyTokens.verifyAccessToken, gameController.updateSponsorInfo);
router.get('/sponsors', verifyTokens.verifyAccessToken, gameController.getSponsors);
// Send the info about the sponsors, so you will send us the logos too for all of this, which would be a path to the image, can be store here or some image hosting place.

router.get('/sponsors/:sponsorId/questions', verifyCsrfToken, verifyTokens.verifyAccessToken, gameController.getMultipleChoice)
router.post('/sponsors/:sponsorId/questions', verifyCsrfToken, verifyTokens.verifyAccessToken, gameController.submitSponsorQuiz)
// only grant coins when all the multiple choice questions are submitted

// potentially overriden by submitSponsorQuestion (auto mark multiple choice)
// router.post("/player/coins/quiz", verifyCsrfToken, verifyTokens.verifyAccessToken, gameController.addQuizCoins); // This is for the coins earned from submitting the sponsor quiz (you can also delete this route and just make one route for adding coins).

router.get("/businesses", verifyTokens.verifyAccessToken, gameController.sendBusinessesInfo);
router.post("/businesses/:businessId/player/meet-ups", verifyCsrfToken, verifyTokens.verifyAccessToken, gameController.addMeetUp); // This is how we'll submit the meetup submissions from whatever the player chooses (yes or maybe is all it is).
router.get("/businesses/winners", verifyTokens.verifyAccessToken, gameController.sendBusinessChallengeWinners); // Challenge winners would be inputted in the admin panel I think.

router.post("/questions/:questionId", verifyCsrfToken, verifyTokens.verifyAccessToken, gameController.saveAnswer);
router.put("/answers/:answerId", verifyCsrfToken, verifyTokens.verifyAccessToken, gameController.updateAnswer);

router.get("/raffle", verifyTokens.verifyAccessToken, gameController.sendRaffleInfo); // Sends us the raffle items and stuff.
router.get("/raffle/coins", verifyTokens.verifyAccessToken, gameController.sendRaffleIndicatorCoins); // This gives use the gold and sliver coins, which is the gold coin means someone placed a coin(s) on that raffle item and the sliver coins means none.
// *There is a socket to listen for the placement of coins on items so we can update in real-time.*
router.get("/raffle/winners", verifyTokens.verifyAccessToken, gameController.sendRaffleWinners); // To do this you'll create a randomizer with better odds for someone with more coins added to that item and find the winner for each raffle item I think or do it whatever way you like.

router.get("/player/coins", verifyTokens.verifyAccessToken, gameController.sendCoinsGainedHistory); // You have to keep track of how the coins were gained (referral, quiz, or whatever) and just send use the type(where it was from) and the coins.

router.get("/results", verifyTokens.verifyAccessToken, gameController.displayEventResults);

export default router;
