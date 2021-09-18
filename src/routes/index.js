import { Router } from 'express';
import authRoutes from './auth.route';
import inventoryRoutes from './inventory.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/inventory', inventoryRoutes);

export default router;
