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

  promisifyConn(queryArr: string[] | any) {
    return new Promise((resolve, reject) => {
      this.connection.query(...queryArr, function (err: MysqlError, res: any) {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  }

  getAllEmployees() {
    return this.promisifyConn([
      'SELECT em1.id AS id ,em1.first AS first ,em1.last AS last, em2.first AS manager_first, em2.last AS manager_last, roles.title FROM employees em1 LEFT JOIN employees em2 ON em1.managerId = em2.id LEFT JOIN roles ON em1.roleId = roles.id',
    ]);
  }

  getAllDepts() {
    return this.promisifyConn(['SELECT * FROM departments ORDER BY id']);
  }

  getAllRoles() {
    return this.promisifyConn([
      'SELECT roles.id,roles.title,roles.salary,departments.name FROM roles LEFT JOIN departments ON roles.deptID = departments.id;',
    ]);
  }
  addDept(dept: string) {
    return this.promisifyConn([
      'INSERT INTO departments(name) VALUES(?)',
      dept,
    ]);
  }

  addRole(roleData: IRole) {
    return this.promisifyConn([
      'INSERT INTO roles(??) VALUES(?,?,?)',
      [
        ['title', 'salary', 'deptId'],
        roleData.title,
        parseFloat(roleData.salary),
        parseInt(roleData.deptId),
      ],
    ]);
  }

  addEmployee(empData: IEmployee) {
    return this.promisifyConn([
      'INSERT INTO employees(??) VALUES(?,?,?,?)',
      [
        ['first', 'last', 'roleId', 'managerId'],
        empData.first,
        empData.last,
        parseInt(empData.roleId),
        parseInt(empData.managerId),
      ],
    ]);
  }

  updateEmployeeRole(role: number, id: number) {
    return this.promisifyConn([
      'UPDATE employees SET roleId=? WHERE id=?',
      [role, id],
    ]);
  }

  updateEmployeeManager(manager: number, id: number) {
    return this.promisifyConn([
      'UPDATE employees SET managerId=? WHERE id=?',
      [manager, id],
    ]);
  }

  viewEmployeesByManager(id: number) {
    return this.promisifyConn([
      `SELECT ?? FROM employees WHERE managerId=?`,
      [['first', 'last', 'roleId'], id],
    ]);
  }
  removeDept(id: number) {
    return this.promisifyConn([`DELETE FROM departments WHERE id=?`, [id]]);
  }

  removeRole(id: number) {
    return this.promisifyConn([`DELETE FROM roles WHERE id=?`, [id]]);
  }

  removeEmployee(id: number) {
    return this.promisifyConn([`DELETE FROM employees WHERE id=?`, id]);
  }

  viewDeptBudget(id: number) {
    return this.promisifyConn([
      `SELECT departments.id,departments.name,roles.title,roles.salary,roles.id,employees.first,employees.last
       FROM ((departments INNER JOIN roles ON departments.id = roles.deptId)
       INNER JOIN employees ON roles.id = employees.roleId) WHERE departments.id=?`,
      [id],
    ]);
  }
  end() {
    this.connection.end();
  }
};
