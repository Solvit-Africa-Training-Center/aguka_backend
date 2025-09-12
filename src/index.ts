import express from 'express';
import { config } from 'dotenv';
import { Database } from './database';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { routers } from './routes';
import { redis } from './utils/redis';
import middleware from 'i18next-http-middleware';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import * as swaggerDocument from './docs/swagger.json';
import { errorLogger, logStartup, requestLogger } from './utils';
import './utils/passport';
import passport from 'passport';


config();

const app = express();
app.use(passport.initialize());
app.use(helmet());
app.use((req, res, next) => {
  requestLogger(req);
  next();
});
app.use(express.json());
app.use('/api/swagger-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'rw'],
    backend: {
      loadPath: './locales/{{lng}}/translation.json',
    },
  });
app.use(middleware.handle(i18next));

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

Database.database
  .authenticate()
  .then(async () => {
    try {
      app.listen(port, () => {
        logStartup(port, process.env.NODE_ENV || 'DEV');
      });
    } catch (error) {
      errorLogger(error as Error, 'Server Startup');
    }
  })
  .catch((error) => {
    errorLogger(error as Error, 'Database Connection');
  });

export { app };
