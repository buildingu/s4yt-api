import { Router } from 'express';
import * as businessController from '../controllers/busController';
import { verifyAccessToken } from '../../authentication/middleware/verifyTokens';

const router = Router();

router.post('/update-info/:businessId', verifyAccessToken, businessController.updateBusinessInfo);
router.post('/challenges/:businessId', verifyAccessToken, businessController.addChallenge);
router.patch('/challenges/:challengeId', verifyAccessToken, businessController.updateChallenge);
router.get('/challenges/:businessId', verifyAccessToken, businessController.getChallenges);
router.get('/answers/:challengeId', verifyAccessToken, businessController.getAnswers);


//router.post('/:businessId/award', businessController.updateAward);
router.get('/:businessId/award', businessController.getAwardDetails);
//router.post('/:businessId/winners', businessController.selectWinners);
router.get('/:businessId/event-results', businessController.getEventResults);


export default router;