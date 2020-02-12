import { MysqlError, Connection } from 'mysql';

module.exports = (dB: any, queryArr: string[]) => {
  return new Promise((resolve, reject) => {
    dB.query(...queryArr, function(err: MysqlError, res: any) {
      if (err) return reject(err);
      return resolve(res);
    });
  });
};
