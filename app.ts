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
    choices: [
      'Get Departments', 
      'Get Roles', 
      'Get Employees', 
      'Add A New Department',
      'Add A New Role',
      'Add A New Employee',
      `Update an Employee's Role`,
      `Update An Employee's Manager`,
      `View All Employee's of Manager`,
      'Remove A Dept',
      'Remove A Role',
      'Remove An Employee',
      `View A Department's Budget`,
      'Done'],
  },
];

// Main functional logic
const init = async () => {
  // let i = 0; Reserved for later use
  while (keepRunning) {
  const { choice } = await ask.prompt(menu);

  choice && (await getChart(choice));
  }
};

const getChart = async (val: string) => {
    let result;
    switch (val) {
      case 'Get Departments':
        result = await queryDb(conn, queries.getAllDepartments());
        console.log(result);
        break;
      case 'Get Roles':
        result = await queryDb(conn, queries.getAllRoles());
        console.log(result);
        break;
      case 'Get Employees':
        result = await queryDb(conn, queries.getAllEmployees());
        console.log(result);
        break;
      case 'Add A New Department':
        const {deptName} = await ask.prompt([{
          message: 'Department Name: ',
          name: 'deptName',
          validate: (input:string) => {
            if (input) return true;
            else return 'You didnt enter a name!'
          }
        }]);
        result = await queryDb(conn, queries.addDept(deptName));
        console.log(result.affectedRows);
        break;
      case 'Done':
        keepRunning = false;
        conn.end();
        break;
    }
};

conn.connect((err: MysqlError) => {
  if (err) throw err;
  console.log(`Connected as id: ${conn.threadId}`);
  init();
});

export {};
