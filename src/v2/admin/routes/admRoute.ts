import { Router } from 'express';
import * as superAdminController from '../controllers/admController';
import verifySuperAdmin from '../middleware/verifySuperAdmin';
import { verifyAccessToken } from '../../authentication/middleware/verifyTokens';
import verifyCsrfToken from '../../csrf/middleware/verifyCsrfToken';

const router = Router();
router.get('/users', verifyCsrfToken, verifyAccessToken, verifySuperAdmin, superAdminController.getAllUsers);
router.get('/emails', verifyCsrfToken, verifyAccessToken, verifySuperAdmin, superAdminController.getAllEmails);
router.post('/users/kick/:userId', verifyCsrfToken, verifyAccessToken, verifySuperAdmin, superAdminController.kickUser);
router.post('/users/ban/:userId', verifyCsrfToken, verifyAccessToken, verifySuperAdmin, superAdminController.banUser);
router.get('/business', verifyCsrfToken, verifyAccessToken, verifySuperAdmin, superAdminController.getAllBusinesses);
router.get('/rsvps', verifyCsrfToken, verifyAccessToken, verifySuperAdmin, superAdminController.getRSVPedUsers);
router.get('/results', verifyCsrfToken, verifyAccessToken, verifySuperAdmin, superAdminController.getEventResults);

export default router;