import { loadEnvironmentVariables } from "../common/utils/environment";
import { Options, Sequelize } from "sequelize";

loadEnvironmentVariables();

const DEFAULT_PORT = 3306;

const connectionConfig: Options = {
  dialect: "mysql",
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : DEFAULT_PORT,
};

export const mySqlDbSequelize = new Sequelize(connectionConfig);
