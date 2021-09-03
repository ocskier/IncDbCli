require('dotenv').config();

import { Connection, MysqlError } from 'mysql';
const mysql = require('mysql');

const options = process.env.LOCALHOST_URL || {
  host: 'localhost',
  port: 3306,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: 'company_db',
};

class DB {
  connection: Connection;
  constructor() {
    this.connection = mysql.createConnection(options);
  }
  asyncQuery(
    query: string,
    values?: string | Array<string | string[] | number>
  ) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        query,
        values,
        function (err: MysqlError, res: any) {
          if (err) return reject(err);
          return resolve(res);
        }
      );
    });
  }
  end() {
    this.connection.end();
  }
}

module.exports = DB;
