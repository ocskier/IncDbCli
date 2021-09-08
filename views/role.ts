const validate = require('../utils/validate');

// Import types for models
import { IRole, IDept } from '../types/schemaTypes';

const roleQues = (depts: [IDept]) => [
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

const getRoleQues = (roles: [IRole]) => [
  {
    message: 'Enter the role name:',
    name: 'roleId',
    type: 'list',
    choices: roles.map((row: IRole) => {
      return {
        name: row.title,
        value: row.id,
      };
    }),
  },
];

module.exports = { roleQues, getRoleQues };
