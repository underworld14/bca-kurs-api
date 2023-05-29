import { Router } from 'express';

import catchAsync from 'exceptions/catchAsync';
import validate from 'middlewares/validate.middleware';
import * as kursController from 'controllers/kurs.controller';
import * as kursValidation from 'validations/kurs.validation';

const router = Router();

router.get('/', catchAsync(kursController.getAll));
router.post('/', validate(kursValidation.kurs), catchAsync(kursController.store));
router.put('/', validate(kursValidation.kurs), catchAsync(kursController.update));
router.get('/:symbol', catchAsync(kursController.getAll));
router.delete('/:date', catchAsync(kursController.destroy));

export default router;
