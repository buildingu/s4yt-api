import { Router } from "express";
import verifyCsrfToken from "../../csrf/middleware/verifyCsrfToken";
import * as verifyTokens from "../middleware/verifyTokens";
import verifyUser from "../middleware/verifyUser";
import * as authController from "../controllers/authController";

const router = Router();

router.post("/register", authController.register);
router.post("/email/verify", authController.emailVerify); // Verifies a user's email with a provided verification token
router.post("/email/sendVerification", authController.resendVerificationEmail); // Sends verification email to user's registered email address with verification token

router.post("/login", authController.login);
router.post("/email/reset", verifyUser, authController.sendResetPasswordEmail); // Sends reset password email when they forget (the reset password email verifies if they're actually a user and the reset password email would also have a button to forward them to /password-reset on the front-end, not sure how to do this) You can also remove this if you want and just verify them with /password and I would also have to input their email with /password I don't know.
router.patch("/password", authController.resetPassword); // Resets password if they forgot it on the password reset page.
router.patch("/player/password", verifyCsrfToken, verifyTokens.verifyAccessToken, authController.updatePassword); // Updates their password when they're logged in (this is located in the profile and you should log them out when it's a success).

router.patch("/player/profile", verifyCsrfToken, verifyTokens.verifyAccessToken, authController.updateProfile); // Updates everything on their profile expect the password, if they update their clear their token.
router.get("/player/referrals", verifyTokens.verifyAccessToken, authController.sendAcceptedReferrals); // Gets their referral history, so anyone who used their referral.
// // *There would also be a referral socket to listen if someone used their referral and give them their coins, not sure how to structure for that, could make a sockets folder or something here.*

router.post("/logout", verifyCsrfToken, authController.logout); // We didn't actually have a logout route, but it makes sense.
router.delete("/user/:email", verifyCsrfToken, verifyTokens.verifyAccessToken, authController.deleteUser); // This one I just added also because why not (if they delete their account any coins they put in the raffle or challenge submission should be delete from them too).

export default router;