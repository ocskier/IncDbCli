// External package imports
const ask = require('inquirer');
const validator = require('validator');
import { MysqlError } from 'mysql';

const conn = require('./db/connection');
const queryDb = require('./db/connectionPromise');
const queries = require('./controllers/controller');

let keepRunning: boolean = true;

const menu = [
  {
    message: 'Choose one of the following: ',
    name: 'choice',
    type: 'list',
    choices: ['1', '2', '3', 'Done'],
  },
];

// Main functional logic
const init = async () => {
  // let i = 0; Reserved for later use

  const { choice } = await ask.prompt(menu);

  choice && (await getChart(choice));

  // ui.log.write('\nManager Logged!\n\n');
};

const getChart = async (val: string) => {
  while (keepRunning) {
    switch (val) {
      case '1':
        const result = await queryDb(conn, queries.getAllEmployees());
        console.log(result);
        keepRunning = false;
        conn.end();
        break;
      case '2':
        break;
      case 'Done':
        keepRunning = false;
        break;
    }
  }
};

conn.connect((err: MysqlError) => {
  if (err) throw err;
  console.log(`Connected as id: ${conn.threadId}`);
  init();
});

export {};
