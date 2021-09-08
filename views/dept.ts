const validate = require('../helpers/validate');

// Import types for models
import { IDept } from '../types/schemaTypes';

const deptQues = () => [
  {
    message: 'Department Name: ',
    name: 'deptName',
    validate: validate.isInput,
  },
];

const removeDeptQues = (depts: [IDept]) => [
  {
    message: 'Enter the department name:',
    name: 'dept_id',
    type: 'list',
    choices: depts.map((dept: IDept) => {
      return { name: dept.name, value: dept.id };
    }),
  },
];

const viewDeptBudgetQues = (depts: [IDept]) => [
  {
    message: 'Enter the department name: ',
    name: 'deptid',
    type: 'list',
    choices: depts.map((dept: IDept) => {
      return { name: dept.name, value: dept.id };
    }),
  },
];

module.exports = { deptQues, removeDeptQues, viewDeptBudgetQues }
