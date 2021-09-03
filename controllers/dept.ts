const conn = require('../db/connection');

class Dept {
  db: typeof conn;
  constructor(db: typeof conn) {
    this.db = db;
  }
  getAllDepts() {
    return this.db.asyncQuery('SELECT * FROM departments ORDER BY id');
  }
  addDept(dept: string) {
    return this.db.asyncQuery('INSERT INTO departments(name) VALUES(?)', dept);
  }
  removeDept(id: number) {
    return this.db.asyncQuery(`DELETE FROM departments WHERE id=?`, [id]);
  }
  viewDeptBudget(id: number) {
    return this.db.asyncQuery(
      `SELECT departments.id,departments.name,roles.title,roles.salary,roles.id,employees.first,employees.last
       FROM ((departments INNER JOIN roles ON departments.id = roles.deptId)
       INNER JOIN employees ON roles.id = employees.roleId) WHERE departments.id=?`,
      [id]
    );
  }
}

module.exports = Dept;

export {};
