import 'regenerator-runtime';
import dotenv from 'dotenv';

import app from './app';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

// handling err unhandled rejection
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION ERR, SHUTTINGDOWN APPLICATION');

  server.close(() => {
    process.exit(1);
  });
});

// handling err uncaught exception
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXPRESSION ERR, SHUTTINGDOWN APPLICATION');

  server.close(() => {
    process.exit(1);
  });
});
