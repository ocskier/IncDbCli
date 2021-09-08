// External package imports
const ask = require('inquirer');
const { printTable } = require('console-table-printer');
const cFonts = require('cfonts');
import { MysqlError } from 'mysql';

// Internal module imports
const db = require('./controllers');
const {
  deptQues,
  getDeptQues,
} = require('./views/dept');
const {
  employeeQues,
  updateEmployeeQues,
  getManagerQues,
  getEmployeeQues,
} = require('./views/employee');
const { roleQues, getRoleQues } = require('./views/role');

// const validator = require('validator');

let keepRunning: boolean = true;

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
  let depts = await db.Dept.getAllDepts();
  let roles = await db.Role.getAllRoles();
  let employees = await db.Employee.getAllEmployees();

  let result, answers;

  try {
    switch (val) {
      case 'Get Departments':
        depts && printTable(depts);
        break;
      case 'Get Roles':
        roles && printTable(roles);
        break;
      case 'Get Employees':
        employees && printTable(employees);
        break;
      case 'Add A New Department':
        const { deptName } = await ask.prompt(deptQues());
        result = await db.Dept.addDept(deptName);
        result &&
          console.log(`\nAdded ${result.affectedRows} new department!\n`);
        result && printTable(await db.Dept.getAllDepts());
        break;
      case 'Add A New Role':
        answers = await ask.prompt(roleQues(depts));
        result = await db.Role.addRole(answers);
        result && console.log(`\nAdded ${result.affectedRows} new role!\n`);
        result && printTable(await db.Role.getAllRoles());
        break;
      case 'Add A New Employee':
        answers = await ask.prompt(employeeQues(employees, roles));
        answers.first = answers.name.split(' ')[0];
        answers.last = answers.name.split(' ')[1];
        delete answers.name;
        result = await db.Employee.addEmployee(answers);
        result && console.log(`\nAdded ${result.affectedRows} new employee!\n`);
        result && printTable(await db.Employee.getAllEmployees());
        break;
      case `Update an Employee's Data`:
        let { id, choice } = await ask.prompt(updateEmployeeQues(employees));
        let updateId;
        switch (choice) {
          case 'Role':
            let { roleId } = await ask.prompt(getRoleQues(roles));
            updateId = roleId;
            break;
          case 'Manager':
            let { managerId } = await ask.prompt(getManagerQues(employees));
            updateId = managerId;
            break;
        }
        result = await db.Employee[`updateEmployee${choice}`](
          parseInt(updateId),
          parseInt(id)
        );
        result && console.log(`\nUpdated ${result.affectedRows} employee!\n`);
        result && printTable(await db.Employee.getAllEmployees());
        break;
      case `View All Employees of Manager`:
        let { managerId } = await ask.prompt(getManagerQues(employees));
        result = await db.Employee.viewEmployeesByManager(parseInt(managerId));
        result.length > 0
          ? printTable(result)
          : console.log('\nEmployee does not have any direct reports!\n');
        break;
      case 'Remove A Dept':
        let { deptId: deptToRemove} = await ask.prompt(getDeptQues(depts));
        result = await db.Dept.removeDept(parseInt(deptToRemove));
        result && console.log(`\nDeleted ${result.affectedRows} department!\n`);
        result && printTable(await db.Dept.getAllDepts());
        break;
      case 'Remove A Role':
        let { roleId } = await ask.prompt(getRoleQues(roles));
        result = await db.Role.removeRole(parseInt(roleId));
        result && console.log(`\nDeleted ${result.affectedRows} role!\n`);
        result && printTable(await db.Role.getAllRoles());
        break;
      case 'Remove An Employee':
        let { empId } = await ask.prompt(getEmployeeQues(employees));
        result = await db.Employee.removeEmployee(parseInt(empId));
        result && console.log(`\nDeleted ${result.affectedRows} employee!\n`);
        result && printTable(await db.Employee.getAllEmployees());
        break;
      case `View A Department's Budget`:
        let { deptId: budgetDeptId } = await ask.prompt(getDeptQues(depts));
        result = await db.Dept.viewDeptBudget(parseInt(budgetDeptId));
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

db.connection.connect((err: MysqlError) => {
  if (err) throw err;
  console.log(`Connected as id: ${db.connection.threadId}`);
  init();
});

export {};
