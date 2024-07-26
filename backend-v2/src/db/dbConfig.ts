// Database configuration

import { QueryError } from "mysql2";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const DEFAULT_PORT = 3306;

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : DEFAULT_PORT,
};

const connection = mysql.createConnection(config);

connection.connect((err: QueryError | null) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

export default connection;
