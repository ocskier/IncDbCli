import { MysqlError } from 'mysql';

const conn = require('./connection');

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

module.exports = class db {
  connection: any;

  constructor() {
    this.connection = conn;
  }

  promisifyConn(queryArr: string[]) {
    return new Promise((resolve, reject) => {
      this.connection.query(...queryArr, function(err: MysqlError, res: any) {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  }

  getAllEmployees() {
    return this.promisifyConn(['SELECT * FROM employees']);
  }

  getAllDepts() {
    return this.promisifyConn(['SELECT * FROM departments']);
  }

  getAllRoles() {
    return this.promisifyConn(['SELECT * FROM roles']);
  }
  addDept(dept: string) {
    return [`INSERT INTO departments(name) VALUES('${dept}')`];
  }

  addRole(roleData: IRole) {
    return [
      `INSERT INTO roles(title,salary,deptId) VALUES('${
        roleData.title
      }',${parseFloat(roleData.salary)},${parseInt(roleData.deptId)})`,
    ];
  }

  addEmployee(empData: IEmployee) {
    return [
      `INSERT INTO employees(first,last,roleId,managerId) VALUES('${
        empData.first
      }','${empData.last}',${parseInt(empData.roleId)},${parseInt(
        empData.managerId
      )})`,
    ];
  }

  updateEmployeeRole(role: number, id: number) {
    return [`UPDATE employees SET roleId=${role} WHERE id=${id}`];
  }

  updateEmployeeManager(manager: number, id: number) {
    return [`UPDATE employees SET managerId=${manager} WHERE id=${id}`];
  }

  viewEmployeesByManager() {}
  removeDept(id: number) {
    return [`DELETE FROM departments WHERE id=${id}`];
  }

  removeRole(id: number) {
    return [`DELETE FROM roles WHERE id=${id}`];
  }

  removeEmployee(id: number) {
    return [`DELETE FROM employees WHERE id=${id}`];
  }

  viewDeptBudget() {}
  end() {
    this.connection.end();
  }
};
