import { Router } from 'express';
import * as businessController from '../controllers/busController';
import { verifyAccessToken } from '../../authentication/middleware/verifyTokens';

const router = Router();

router.post('/update-info/:businessId', verifyAccessToken, businessController.updateBusinessInfo);
router.post('/questions/:businessId', verifyAccessToken, businessController.addQuestion);
router.patch('/questions/:questionId', verifyAccessToken, businessController.updateQuestion);
router.get('/questions/:businessId', verifyAccessToken, businessController.getQuestions);
router.get('/answers/:questionId', verifyAccessToken, businessController.getAnswers);

export default router;