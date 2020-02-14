interface IRole {
  title: string;
  salary: string;
  deptId: string;
}

interface IEmployee {
  first: string;
  last: string;
  roleId: string;
  managerId: string;
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
  addDept: (dept: string) => {
    return [`INSERT INTO departments(name) VALUES('${dept}')`];
  },
  addRole: (roleData: IRole) => {
    return [
      `INSERT INTO roles(title,salary,deptId) VALUES('${
        roleData.title
      }',${parseFloat(roleData.salary)},${parseInt(roleData.deptId)})`,
    ];
  },
  addEmployee: (empData: IEmployee) => {
    return [
      `INSERT INTO employees(first,last,roleId,managerId) VALUES('${
        empData.first
      }','${empData.last}',${parseInt(empData.roleId)},${parseInt(
        empData.managerId
      )})`,
    ];
  },
  updateEmployeeRole: (role: number, id: number) => {
    return [`UPDATE employees SET roleId=${role} WHERE id=${id}`];
  },
  updateEmployeeManager: (manager: number, id: number) => {
    return [`UPDATE employees SET managerId=${manager} WHERE id=${id}`];
  },
  viewEmployeesByManager: () => {},
  removeDept: () => {},
  removeRole: () => {},
  removeEmployee: () => {},
  viewDeptBudget: () => {},
};
