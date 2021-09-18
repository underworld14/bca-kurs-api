import httpStatus from 'http-status';
import HttpException from 'exceptions/HttpException';

const errorMiddleware = (error, req, res, next) => {
  if (!(error instanceof HttpException)) {
    const status = httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[status];
    error = new HttpException(status, message);
  }

  const response = {
    code: error.status,
    message: error.message,
    stack: error.stack,
  };

  if (process.env.NODE_ENV === 'production') {
    delete response.stack;
  }

  console.error(
    `[${req.method}] ${req.path} >> StatusCode:: ${error.status}, Message:: ${error.message}`,
  );

  res.status(error.status);
  res.json(response);
};

export default errorMiddleware;
