import { Router } from 'express';
import * as businessController from '../controllers/busController';
import { verifyAccessToken } from '../../authentication/middleware/verifyTokens';

const router = Router();

router.get('/challenges/:businessId', verifyAccessToken, businessController.getChallenges);
router.get('/answers/:challengeId', verifyAccessToken, businessController.getAnswers);
router.get('/:businessId/award', verifyAccessToken, businessController.getAwardDetails);
router.get('/:businessId/event-results', verifyAccessToken, businessController.getEventResults);

export default router;