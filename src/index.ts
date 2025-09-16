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
import { errorLogger, logStartup, requestLogger } from './utils';
import './utils/passport';
import passport from 'passport';
import swaggerDocument from './docs/swagger.json';

config();

const app = express();
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false, 
}));
app.use(passport.initialize());
app.use(helmet());
app.use((req, res, next) => {
  requestLogger(req);
  next();
});
app.use(express.json());

const swaggerSpec: any = JSON.parse(JSON.stringify(swaggerDocument));

swaggerSpec.servers = [
  {
    url:
      process.env.ENV === 'PROD' ? 'https://aguka.onrender.com/api' : 'http://localhost:3000/api',
    description:
      process.env.ENV === 'PROD' ? 'Render production server' : 'Local development server',
  },
];

app.use('/api/swagger-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(routers);
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

const port = parseInt(process.env.PORT as string, 10) || 3000;

Database.database
  .authenticate()
  .then(async () => {
    logStartup(port, 'Database connected');
    app.listen(port, () => {
      logStartup(port, `Server running in ${process.env.ENV || 'DEV'} mode`);
    });
  })
  .catch((error) => {
    errorLogger(error as Error, 'Database Connection');
  });

export { app };
