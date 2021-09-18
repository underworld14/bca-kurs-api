import { Router } from 'express';

import catchAsync from 'exceptions/catchAsync';
import * as authController from 'controllers/auth.controller';
import authMiddleware from 'middlewares/auth.middleware';
import validate from 'middlewares/validate.middleware';
import * as validations from 'validations/auth.validation';

const router = Router();

router.post('/register', validate(validations.register), catchAsync(authController.register));
router.post('/login', validate(validations.login), catchAsync(authController.login));
router.get('/check', authMiddleware, catchAsync(authController.check));

export default router;
