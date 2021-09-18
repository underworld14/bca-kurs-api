import path from 'path';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import errorMiddleware from 'middlewares/error.middleware';
import HttpException from 'exceptions/HttpException';

// routes
import apiRoutes from 'routes';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());

// api routes
app.use('/api', apiRoutes);

// 404 unknown routes
app.use((req, res, next) => {
  next(new HttpException(httpStatus.NOT_FOUND, 'Not found'));
});
// handle error
app.use(errorMiddleware);

export default app;
