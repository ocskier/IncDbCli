const conn = require('../db/connection');

interface IRole {
  title: string;
  salary: string;
  deptId: string;
}

class Role {
  db: typeof conn;
  constructor(db: typeof conn) {
    this.db = db;
  }
  getAllRoles() {
    return this.db.asyncQuery(
      'SELECT roles.id,roles.title,roles.salary,departments.name FROM roles LEFT JOIN departments ON roles.deptID = departments.id;'
    );
  }
  addRole(roleData: IRole) {
    return this.db.asyncQuery('INSERT INTO roles(??) VALUES(?,?,?)', [
      ['title', 'salary', 'deptId'],
      roleData.title,
      parseFloat(roleData.salary),
      parseInt(roleData.deptId),
    ]);
  }
  removeRole(id: number) {
    return this.db.asyncQuery(`DELETE FROM roles WHERE id=?`, [id]);
  }
}

module.exports = Role;

export {};
