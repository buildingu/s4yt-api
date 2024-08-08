import { Router } from 'express';
import * as businessController from '../controllers/busController';
import { verifyAccessToken } from '../../authentication/middleware/verifyTokens';

const router = Router();

router.post('/update-info', verifyAccessToken, businessController.updateBusinessInfo);
router.post('/questions/:businessId', verifyAccessToken, businessController.addQuestion);
router.put('/questions/:questionId', verifyAccessToken, businessController.updateQuestion);
router.get('/questions', verifyAccessToken, businessController.getQuestions);
router.get('/answers', verifyAccessToken, businessController.getAnswers);

export default router;