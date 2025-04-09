import { Router } from 'express';
import * as businessController from '../controllers/busController';
import { verifyAccessToken } from '../../authentication/middleware/verifyTokens';
import verifyCsrfToken from '../../csrf/middleware/verifyCsrfToken';

const router = Router();

router.get('/info', verifyCsrfToken, verifyAccessToken, businessController.sendBusinessesInfo);
router.get('/:businessId/award', verifyAccessToken, businessController.getAwardDetails);
router.get('/:businessId/event-results', verifyAccessToken, businessController.getEventResults);

export default router;