import { Router } from 'express';
import * as businessIslandController from '../controllers/busIslandController';
import { verifyAccessToken } from '../../authentication/middleware/verifyTokens';

const router = Router();

router.get('/', verifyAccessToken, businessIslandController.getBusinesses);

export default router;