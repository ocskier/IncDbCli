const Database = require('../db/connection');

const DeptController = require('./dept');
const EmployeeController = require('./employee');
const RoleController = require('./role');

const db = new Database();
db.Dept = new DeptController(db),
db.Employee = new EmployeeController(db),
db.Role = new RoleController(db),

module.exports = db;
