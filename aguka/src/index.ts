// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';

// dotenv.config();

// export const sequelize = new Sequelize(
//   process.env.DATABASE_NAME || 'ikaze_database',
//   process.env.DATABASE_USER || 'postgres',
//   process.env.DATABASE_PASSWORD || '',
//   {
//     host: process.env.DATABASE_HOST || 'localhost',
//     port: Number(process.env.DATABASE_PORT) || 5432,
//     dialect: 'postgres',
//     logging: false,
//   },
// );

import express from 'express';
import { config } from 'dotenv';
import { routers } from './routes';
import { redis } from './utils/redis';
import { errorLogger, logStartup, requestLogger } from './utils';

config();

const app = express();
app.use((req, res, next) => {
  requestLogger(req);
  next();
});
app.use(express.json());

app.use(routers);

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    success: false,
    message: 'The requested resource was not found',
  });
});

redis.connect().catch((error) => errorLogger(error, 'Redis Connection'));

const port = parseInt(process.env.PORT as string) || 5000;

app.listen(port, () => {
  logStartup(port, process.env.NODE_ENV || 'DEV');
});

export { app };
