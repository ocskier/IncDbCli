const conn = require('../db/connection');

interface IEmployeeInput {
  first: string;
  last: string;
  roleId: string;
  managerId: string;
}

class Employee {
  db: typeof conn;
  constructor(db: typeof conn) {
    this.db = db;
  }
  getAllEmployees() {
    return this.db.asyncQuery(
      'SELECT em1.id AS id ,em1.first AS first ,em1.last AS last, em2.first AS manager_first, em2.last AS manager_last, roles.title FROM employees em1 LEFT JOIN employees em2 ON em1.managerId = em2.id LEFT JOIN roles ON em1.roleId = roles.id'
    );
  }

  addEmployee(empData: IEmployeeInput) {
    return this.db.asyncQuery('INSERT INTO employees(??) VALUES(?,?,?,?)', [
      ['first', 'last', 'roleId', 'managerId'],
      empData.first,
      empData.last,
      parseInt(empData.roleId),
      parseInt(empData.managerId),
    ]);
  }

  updateEmployeeRole(role: number, id: number) {
    return this.db.asyncQuery('UPDATE employees SET roleId=? WHERE id=?', [
      role,
      id,
    ]);
  }

  updateEmployeeManager(manager: number, id: number) {
    return this.db.asyncQuery('UPDATE employees SET managerId=? WHERE id=?', [
      manager,
      id,
    ]);
  }

  viewEmployeesByManager(id: number) {
    return this.db.asyncQuery(`SELECT ?? FROM employees WHERE managerId=?`, [
      ['first', 'last', 'roleId'],
      id,
    ]);
  }

  removeEmployee(id: number) {
    return this.db.asyncQuery(`DELETE FROM employees WHERE id=?`, [id]);
  }
}

module.exports = Employee;  

export {};
