const dotenv = require('dotenv');
dotenv.config();
const getPrefix = () => {
  let env = process.env.ENV;
  if (!env) {
    return (env = 'DEV');
  }
  return env;
};

const databaseConfig = () => {
  const env = getPrefix();
  
  if (process.env.DATABASE_URL) {
    return {
      use_env_variable: 'DATABASE_URL',
      url: process.env.DATABASE_URL,
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    };
  }
  return {
    username: process.env[`${env}_USERNAME`] || '',
    database: process.env[`${env}_DATABASE`] || '',
    password: process.env[`${env}_PASSWORD`] || '',
    host: process.env[`${env}_HOST`] || '',
    port: Number(process.env[`${env}_PORT`]) || 5432,
    dialect: 'postgres',
  };
};

module.exports = databaseConfig;
