import { Router } from 'express';
import * as superAdminController from '../controllers/admController';
import verifySuperAdmin from '../middleware/verifySuperAdmin';

const router = Router();

router.get('/users', verifySuperAdmin, superAdminController.getAllUsers);
router.post('/users/kick/:userId', verifySuperAdmin, superAdminController.kickUser);
router.post('/users/ban/:userId', verifySuperAdmin, superAdminController.banUser);
router.get('/business', superAdminController.getAllBusinesses); // TODO: needs verifySuperAdmin
router.post('/business', superAdminController.createBusiness); // TODO: needs verifySuperAdmin
router.post('/chest', superAdminController.createChests); // For testing purposes

export default router;