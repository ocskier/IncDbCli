require('dotenv').config();

const mysql = require('mysql');
import { MysqlError } from 'mysql';

const options = {
  host: 'localhost',
  port: 3306,
  user: process.env.USER_NAME,
  password: process.env.MY_PASSWORD,
  database: 'company_db',
};

const connection = mysql.createConnection(options);

module.exports = connection;
