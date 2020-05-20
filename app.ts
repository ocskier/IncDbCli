// External package imports
const ask = require('inquirer');
const { printTable } = require('console-table-printer');
const cFonts = require('cfonts');
import { MysqlError } from 'mysql';

// Internal module imports
const connection = require('./db/connection');
const Database = require('./db/controller');

// Import types for models
import { IRole, IEmployee, IDept } from './types/schemaTypes';

// const validator = require('validator');

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

// Main functional logic
const init = async () => {
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
        'DONE !',
      ],
    },
  ];

  console.log(
    '--------------------------------------------------------------------------------'
  );
  cFonts.say('Jackson Inc. Directory', {
    font: 'tiny',
    align: 'left',
    colors: ['white'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    space: false,
    maxLength: '0',
    gradient: 'green,blue',
    independentGradient: false,
    transitionGradient: false,
    env: 'node',
  });
  console.log(
    '--------------------------------------------------------------------------------'
  );

  while (keepRunning) {
    const { choice } = await ask.prompt(menu);
    choice && (await getChoice(choice));
  }
};

const getChoice = async (val: string) => {
  let depts = await db.getAllDepts();
  let roles = await db.getAllRoles();
  let employees = await db.getAllEmployees();

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
      type: 'list',
      choices: Array.from(depts, (dept: IDept) => {
        return { name: dept.name, value: dept.id };
      }),
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
      type: 'list',
      choices: Array.from(roles, (role: IRole) => {
        return { name: role.title, value: role.id };
      }),
    },
    {
      message: 'Manager Id: ',
      name: 'managerId',
      type: 'list',
      choices: Array.from(employees, (employee: IEmployee) => {
        return {
          name: `${employee.first} ${employee.last}`,
          value: employee.id,
        };
      }),
    },
  ];
  let result, answers;

  try {
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
        result &&
          console.log(`\nAdded ${result.affectedRows} new department!\n`);
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
        employees = await db.getAllEmployees();
        let { id, choice } = await ask.prompt([
          {
            message: 'Enter an employee name:',
            name: 'id',
            type: 'list',
            choices: employees.map((employee: IEmployee) => {
              return {
                name: `${employee.first} ${employee.last}`,
                value: employee.id,
              };
            }),
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
            roles = await db.getAllRoles();
            let { role } = await ask.prompt({
              message: 'Choose a role: ',
              name: 'role',
              type: 'list',
              choices: roles.map((row: IRole) => {
                return {
                  name: row.title,
                  value: row.id,
                };
              }),
            });
            updateId = role;
            break;
          case 'Manager':
            employees = await db.getAllEmployees();
            let { manager } = await ask.prompt({
              message: 'Enter a manager name: ',
              name: 'manager',
              type: 'list',
              choices: employees.map((row: IEmployee) => {
                return {
                  name: `${row.first} ${row.last}`,
                  value: row.id,
                };
              }),
            });
            updateId = manager;
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
        employees = await db.getAllEmployees();
        let { managerId } = await ask.prompt({
          message: 'Enter a manager name:',
          name: 'managerId',
          type: 'list',
          choices: employees.map((employee: IEmployee) => {
            return {
              name: `${employee.first} ${employee.last}`,
              value: employee.id,
            };
          }),
        });
        result = await db.viewEmployeesByManager(parseInt(managerId));
        result.length > 0
          ? printTable(result)
          : console.log('\nEmployee does not have any direct reports!\n');
        break;
      case 'Remove A Dept':
        depts = await db.getAllDepts();
        let { dept_id } = await ask.prompt({
          message: 'Enter the department name:',
          name: 'dept_id',
          type: 'list',
          choices: depts.map((dept: IDept) => {
            return { name: dept.name, value: dept.id };
          }),
        });
        result = await db.removeDept(parseInt(dept_id));
        result && console.log(`\nDeleted ${result.affectedRows} department!\n`);
        result && printTable(await db.getAllDepts());
        break;
      case 'Remove A Role':
        roles = await db.getAllRoles();
        let { role_id } = await ask.prompt({
          message: 'Enter the role name:',
          name: 'role_id',
          type: 'list',
          choices: roles.map((row: IRole) => {
            return {
              name: row.title,
              value: row.id,
            };
          }),
        });
        result = await db.removeRole(parseInt(role_id));
        result && console.log(`\nDeleted ${result.affectedRows} role!\n`);
        result && printTable(await db.getAllRoles());
        break;
      case 'Remove An Employee':
        employees = await db.getAllEmployees();
        let { emp_id } = await ask.prompt({
          message: 'Enter an employee name: ',
          name: 'emp_id',
          type: 'list',
          choices: employees.map((employee: IEmployee) => {
            return {
              name: `${employee.first} ${employee.last}`,
              value: employee.id,
            };
          }),
        });
        result = await db.removeEmployee(parseInt(emp_id));
        result && console.log(`\nDeleted ${result.affectedRows} employee!\n`);
        result && printTable(await db.getAllEmployees());
        break;
      case `View A Department's Budget`:
        depts = await db.getAllDepts();
        let { deptid } = await ask.prompt({
          message: 'Enter the department name: ',
          name: 'deptid',
          type: 'list',
          choices: depts.map((dept: IDept) => {
            return { name: dept.name, value: dept.id };
          }),
        });
        result = await db.viewDeptBudget(parseInt(deptid));
        result.length &&
          console.log(
            `\n${result[0].name} Budget: $${result.reduce((a: any, b: any) => {
              return (a += b.salary);
            }, 0)}\n`
          );
        !result.length && console.log('\nNo employees in this department!\n');
        break;
      case 'DONE !':
        keepRunning = false;
        db.end();
        break;
    }
  } catch (err) {
    console.log(err);
  }
};

connection.connect((err: MysqlError) => {
  if (err) throw err;
  console.log(`Connected as id: ${connection.threadId}`);
  init();
});

export {};
