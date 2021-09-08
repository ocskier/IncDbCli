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
  _connection: Connection;
  constructor() {
    this._connection = mysql.createConnection(options);
  }
  get connection() { return this._connection; }
  asyncQuery(
    query: string,
    values?: string | Array<string | string[] | number>
  ) {
    return new Promise((resolve, reject) => {
      this._connection.query(
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
    this._connection.end();
  }
}

module.exports = DB;
