require('dotenv').config();

const mysql = require('mysql');

const options = {
  host: '127.0.0.1',
  port: 3306,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: 'company_db',
};

const connection = mysql.createConnection(options);

module.exports = connection;
