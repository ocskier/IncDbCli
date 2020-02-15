import { MysqlError } from 'mysql';

// External package imports
const ask = require('inquirer');
const connection = require('./db/connection');
const { printTable } = require('console-table-printer');

// const validator = require('validator');

const Database = require('./db/controller');
const db = new Database();

let keepRunning: boolean = true;

const validate = {
  isInput: (text: string) => {
    if (text) return true;
    else return 'You didnt enter a valid string!';
  },
  isInt: (text: string) => {
    if (!isNaN(parseInt(text))) return true;
    else return 'You didnt enter a valid number!';
  },
  isFloat: (text: string) => {
    if (!isNaN(parseFloat(text))) return true;
    else return 'You didnt enter a valid number!';
  },
};

const makeIdQues = (text: string) => {
  return `What is the ${text} id?`;
};

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
      'Done !',
    ],
  },
];

const roleQues = [
  {
    message: 'Role: ',
    name: 'title',
    validate: validate.isInput,
  },
  {
    message: 'Salary: ',
    name: 'salary',
    validate: validate.isFloat,
  },
  {
    message: 'Dept ID: ',
    name: 'deptId',
    validate: validate.isInt,
  },
];

const employeeQues = [
  {
    message: 'Full Name: ',
    name: 'name',
    validate: validate.isInput,
  },
  {
    message: 'Role Id: ',
    name: 'roleId',
    validate: validate.isInt,
  },
  {
    message: 'Manager Id: ',
    name: 'managerId',
    validate: validate.isInt,
  },
];

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
          validate: validate.isInput,
        },
      ]);
      result = await db.addDept(deptName);
      result && console.log(`\nAdded ${result.affectedRows} new department!\n`);
      result && printTable(await db.getAllDepts());
      break;
    case 'Add A New Role':
      answers = await ask.prompt(roleQues);
      result = await db.addRole(answers);
      result && console.log(`\nAdded ${result.affectedRows} new role!\n`);
      result && printTable(await db.getAllRoles());
      break;
    case 'Add A New Employee':
      answers = await ask.prompt(employeeQues);
      answers.first = answers.name.split(' ')[0];
      answers.last = answers.name.split(' ')[1];
      delete answers.name;
      result = await db.addEmployee(answers);
      result && console.log(`\nAdded ${result.affectedRows} new employee!\n`);
      result && printTable(await db.getAllEmployees());
      break;
    case `Update an Employee's Data`:
      let { id, choice } = await ask.prompt([
        {
          message: makeIdQues('employee'),
          name: 'id',
          validate: validate.isInt,
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
            validate: validate.isInt,
          });
          updateId = roleId;
          break;
        case 'Manager':
          let { managerId } = await ask.prompt({
            message: makeIdQues('new manager'),
            name: 'managerId',
            validate: validate.isInt,
          });
          updateId = managerId;
          break;
      }
      result = await db[`updateEmployee${choice}`](
        parseInt(updateId),
        parseInt(id)
      );
      result && console.log(`\nUpdated ${result.affectedRows} employee!\n`);
      result && printTable(await db.getAllEmployees());
      break;
    case `View All Employees of Manager`:
      let { managerId } = await ask.prompt({
        message: makeIdQues('manager'),
        name: 'managerId',
        validate: validate.isInt,
      });
      result = await db.viewEmployeesByManager(parseInt(managerId));
      result.length > 0
        ? printTable(result)
        : console.log('\nEmployee does not have any direct reports!\n');
      break;
    case 'Remove A Dept':
      let { dept_id } = await ask.prompt({
        message: makeIdQues('department'),
        name: 'dept_id',
        validate: validate.isInt,
      });
      result = await db.removeDept(parseInt(dept_id));
      result && console.log(`\nDeleted ${result.affectedRows} department!\n`);
      result && printTable(await db.getAllDepts());
      break;
    case 'Remove A Role':
      let { role_id } = await ask.prompt({
        message: makeIdQues('role'),
        name: 'role_id',
        validate: validate.isInt,
      });
      result = await db.removeRole(parseInt(role_id));
      result && console.log(`\nDeleted ${result.affectedRows} role!\n`);
      result && printTable(await db.getAllRoles());
      break;
    case 'Remove An Employee':
      let { emp_id } = await ask.prompt({
        message: makeIdQues('employee'),
        name: 'emp_id',
        validate: validate.isInt,
      });
      result = await db.removeEmployee(parseInt(emp_id));
      result && console.log(`\nDeleted ${result.affectedRows} employee!\n`);
      result && printTable(await db.getAllEmployees());
      break;
    case `View A Department's Budget`:
      let { deptid } = await ask.prompt({
        message: makeIdQues('department'),
        name: 'deptid',
        validate: validate.isInt,
      });
      result = await db.viewDeptBudget(parseInt(deptid));
      result &&
        console.log(
          `\n${result[0].name} Budget: $${result.reduce((a: any, b: any) => {
            return (a += b.salary);
          }, 0)}\n`
        );
      break;
    case 'Done !':
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
