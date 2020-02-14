// External package imports
const ask = require('inquirer');
const validator = require('validator');
const { printTable } = require('console-table-printer');
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
      'Done',
    ],
  },
];

const roleQues = [
  {
    message: 'Role: ',
    name: 'title',
    validate: (input: string) => {
      if (input) return true;
      else return 'You didnt enter a name!';
    },
  },
  {
    message: 'Salary: ',
    name: 'salary',
    validate: (input: string) => {
      if (!isNaN(parseFloat(input))) return true;
      else return 'You didnt enter a valid number!';
    },
  },
  {
    message: 'Dept ID: ',
    name: 'deptId',
    validate: (input: string) => {
      if (!isNaN(parseInt(input))) return true;
      else return 'You didnt enter a valid number!';
    },
  },
];

const employeeQues = [
  {
    message: 'Full Name: ',
    name: 'name',
    validate: (input: string) => {
      if (input) return true;
      else return 'You didnt enter a name!';
    },
  },
  {
    message: 'Role Id: ',
    name: 'roleId',
    validate: (input: string) => {
      if (!isNaN(parseInt(input))) return true;
      else return 'You didnt enter a valid number!';
    },
  },
  {
    message: 'Manager Id: ',
    name: 'managerId',
    validate: (input: string) => {
      if (!isNaN(parseInt(input))) return true;
      else return 'You didnt enter a valid number!';
    },
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
  let result, answers;
  switch (val) {
    case 'Get Departments':
      result = await queryDb(conn, queries.getAllDepts());
      printTable(result);
      break;
    case 'Get Roles':
      result = await queryDb(conn, queries.getAllRoles());
      printTable(result);
      break;
    case 'Get Employees':
      result = await queryDb(conn, queries.getAllEmployees());
      printTable(result);
      break;
    case 'Add A New Department':
      const { deptName } = await ask.prompt([
        {
          message: 'Department Name: ',
          name: 'deptName',
          validate: (input: string) => {
            if (input) return true;
            else return 'You didnt enter a name!';
          },
        },
      ]);
      result = await queryDb(conn, queries.addDept(deptName));
      console.log(result.affectedRows);
      break;
    case 'Add A New Role':
      answers = await ask.prompt(roleQues);
      result = await queryDb(conn, queries.addRole(answers));
      console.log(result.affectedRows);
      break;
    case 'Add A New Employee':
      answers = await ask.prompt(employeeQues);
      answers.first = answers.name.split(' ')[0];
      answers.last = answers.name.split(' ')[1];
      delete answers.name;
      result = await queryDb(conn, queries.addEmployee(answers));
      console.log(result.affectedRows);
      break;
    case `Update an Employee's Role`:
      let { id, roleId } = await ask.prompt([
        {
          message: `What is the employee's id?`,
          name: 'id',
        },
        {
          message: `What is the new role id?`,
          name: 'roleId',
        },
      ]);
      result = await queryDb(conn, queries.updateEmployeeRole(roleId, id));
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