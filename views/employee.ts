const validate = require('../helpers/validate');

// Import types for models
import { IRole, IEmployee } from '../types/schemaTypes';

const employeeQues = (employees: [IEmployee], roles: [IRole]) => [
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

const updateEmployeeQues = (employees: [IEmployee]) => [
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
];

const updateEmployeeRoleQues = (roles: [IRole]) => [
  {
    message: 'Choose a role: ',
    name: 'role',
    type: 'list',
    choices: roles.map((row: IRole) => {
      return {
        name: row.title,
        value: row.id,
      };
    }),
  },
];

const updateEmployeeManagerQues = (employees: [IEmployee]) => [
  {
    message: 'Enter a manager name: ',
    name: 'manager',
    type: 'list',
    choices: employees.map((row: IEmployee) => {
      return {
        name: `${row.first} ${row.last}`,
        value: row.id,
      };
    }),
  },
];

const viewAllManagerEmployeesQues = (employees: [IEmployee]) => [
  {
    message: 'Enter a manager name:',
    name: 'managerId',
    type: 'list',
    choices: employees.map((employee: IEmployee) => {
      return {
        name: `${employee.first} ${employee.last}`,
        value: employee.id,
      };
    }),
  },
];

const removeEmployeeQues = (employees: [IEmployee]) => [
  {
    message: 'Enter an employee name: ',
    name: 'emp_id',
    type: 'list',
    choices: employees.map((employee: IEmployee) => {
      return {
        name: `${employee.first} ${employee.last}`,
        value: employee.id,
      };
    }),
  },
];

module.exports = {
  employeeQues,
  updateEmployeeQues,
  updateEmployeeRoleQues,
  updateEmployeeManagerQues,
  viewAllManagerEmployeesQues,
  removeEmployeeQues,
};
