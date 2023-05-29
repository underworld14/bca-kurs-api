import { Router } from 'express';
import * as kursController from 'controllers/kurs.controller';
import catchAsync from 'exceptions/catchAsync';
import kursRouter from './kurs.route';

const router = Router();

router.get('/', (req, res) => res.send('Kurs Api Server'));
router.get('/indexing', catchAsync(kursController.index));
router.use('/kurs', kursRouter);

export default router;
