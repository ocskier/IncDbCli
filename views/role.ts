const validate = require('../helpers/validate');

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

const removeRoleQues = (roles: [IRole]) => [
  {
    message: 'Enter the role name:',
    name: 'role_id',
    type: 'list',
    choices: roles.map((row: IRole) => {
      return {
        name: row.title,
        value: row.id,
      };
    }),
  },
];

module.exports = { roleQues, removeRoleQues };
