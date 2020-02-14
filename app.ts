import { MysqlError } from 'mysql';

// External package imports
const ask = require('inquirer');
const connection = require('./db/connection');
const validator = require('validator');
const { printTable } = require('console-table-printer');

const Database = require('./db/controller');
const db = new Database();

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
      `Update an Employee's Data`,
      `View All Employees of Manager`,
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

const makeIdQues = (text: string) => {
  return `What is the ${text} id?`;
};

// Main functional logic
const init = async () => {
  printTable([{ '  Jackson Inc. Employee Database ': null }]);
  while (keepRunning) {
    const { choice } = await ask.prompt(menu);
    choice && (await getChart(choice));
  }
};

const getChart = async (val: string) => {
  let result, answers;
  switch (val) {
    case 'Get Departments':
      result = await db.getAllDepts();
      result && printTable(result);
      break;
    case 'Get Roles':
      result = await db.getAllRoles();
      result && printTable(result);
      break;
    case 'Get Employees':
      result = await db.getAllEmployees();
      result && printTable(result);
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
      result = await db.addDept(deptName);
      result && console.log(`\nAdded ${result.affectedRows} new department!\n`);
      break;
    case 'Add A New Role':
      answers = await ask.prompt(roleQues);
      result = await db.addRole(answers);
      result && console.log(`\nAdded ${result.affectedRows} new role!\n`);
      break;
    case 'Add A New Employee':
      answers = await ask.prompt(employeeQues);
      answers.first = answers.name.split(' ')[0];
      answers.last = answers.name.split(' ')[1];
      delete answers.name;
      result = await db.addEmployee(answers);
      result && console.log(`\nAdded ${result.affectedRows} new employee!\n`);
      break;
    case `Update an Employee's Data`:
      let { id, choice } = await ask.prompt([
        {
          message: makeIdQues("employee's"),
          name: 'id',
        },
        {
          message: 'Choose which to update: ',
          type: 'list',
          choices: ['Role', 'Manager'],
          name: 'choice',
        },
      ]);
      let updateId;
      switch (choice) {
        case 'Role':
          let { roleId } = await ask.prompt({
            message: makeIdQues('new role'),
            name: 'roleId',
          });
          updateId = roleId;
          break;
        case 'Manager':
          let { managerId } = await ask.prompt({
            message: makeIdQues('new manager'),
            name: 'managerId',
          });
          updateId = managerId;
          break;
      }
      result = await db[`updateEmployee${choice}`](
        parseInt(updateId),
        parseInt(id)
      );
      result && console.log(`\nUpdated ${result.affectedRows} employee!\n`);
      break;
    case `View All Employees of a Manager`:

    case 'Remove A Dept':
      let { dept_id } = await ask.prompt({
        message: makeIdQues('department'),
        name: 'dept_id',
      });
      result = await db.removeDept(parseInt(dept_id));
      result && console.log(`\nDeleted ${result.affectedRows} department!\n`);
      break;
    case 'Remove A Role':
      let { role_id } = await ask.prompt({
        message: makeIdQues('department'),
        name: 'role_id',
      });
      result = await db.removeRole(parseInt(role_id));
      result && console.log(`\nDeleted ${result.affectedRows} role!\n`);
      break;
    case 'Remove An Employee':
      let { emp_id } = await ask.prompt({
        message: makeIdQues('department'),
        name: 'emp_id',
      });
      result = await db.removeEmployee(parseInt(emp_id));
      result && console.log(`\nDeleted ${result.affectedRows} employee!\n`);
      break;
    case `View A Department's Budget`:
      break;
    case 'Done':
      keepRunning = false;
      db.end();
      break;
  }
};

connection.connect((err: MysqlError) => {
  if (err) throw err;
  console.log(`Connected as id: ${connection.threadId}`);
  init();
});

export {};
