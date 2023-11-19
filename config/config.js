const dotenv = require('dotenv');
dotenv.config();
const ENV = process.env;

const development = {
  username: ENV.DEV_MYSQL_USERNAME,
  password: ENV.DEV_MYSQL_PASSWORD,
  database: ENV.DEV_MYSQL_DB_NAME,
  host: ENV.DEV_MYSQL_HOST,
  dialect: 'mysql',
};

const test = {
  username: ENV.TEST_MYSQL_USERNAME,
  password: ENV.TEST_MYSQL_PASSWORD,
  database: ENV.TEST_MYSQL_DB_NAME,
  host: ENV.TEST_MYSQL_HOST,
  dialect: 'mysql',
};

const production = {
  username: ENV.PRODN_MYSQL_USERNAME,
  password: ENV.PRODN_MYSQL_PASSWORD,
  database: ENV.PRODN_MYSQL_DB_NAME,
  host: ENV.PRODN_MYSQL_HOST,
  dialect: 'mysql',
};

module.exports = { development, production, test };
