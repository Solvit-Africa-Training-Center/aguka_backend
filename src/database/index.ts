import databaseConfig from '../config/config';
import { Sequelize } from 'sequelize';
import { AllModal } from './models';

interface ConfigInterface {
  username: string;
  password: string;
  database: string;
  port: number;
  host: string;
}

const dbConnection = () => {
  let sequelize: Sequelize;

  if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
    });
  } else {
    const db_config = databaseConfig() as ConfigInterface;
    sequelize = new Sequelize({
      ...db_config,
      dialect: 'postgres',
      logging: false,
    });
  }

  return sequelize;
};

const sequelizeInstance = dbConnection();
const models = AllModal(sequelizeInstance);

export type DatabaseType = typeof models & { database: Sequelize };

export const Database = { ...models, database: sequelizeInstance };
