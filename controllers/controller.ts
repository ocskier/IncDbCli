interface IRole {
  title: string;
  salary: number;
  deptId: number;
}

interface IEmployee {
  first: string;
  last:string;
  roleId: number;
  managerId: number;
}

module.exports = {
  getAllEmployees: () => {
    return ['SELECT * FROM employees'];
  },
  getAllDepts: () => {
    return ['SELECT * FROM departments'];
  },
  getAllRoles: () => {
    return ['SELECT * FROM roles'];
  },
  addDept: (dept:string) => {
    return [`INSERT INTO departments(name) VALUES('${dept}')`]
  },
  addRole: (roleData:IRole) => {
    return [`INSERT INTO roles(title,salary,deptId) VALUES('${roleData.title}','${roleData.salary}','${roleData.deptId}'`]
  },
  addEmployee: (empData:IEmployee) => {
    return [`INSERT INTO employees(first,last,roleId,managerId) VALUES(${empData}`]
  },
  updateEmployeeRole: () => {

  },
  updateEmployeeManager: () => {

  },
  viewEmployeesByManager: () => {

  },
  removeDept: () => {

  },
  removeRole: () => {

  },
  removeEmployee: () => {

  },
  viewDeptBudget: () => {

  }
};
