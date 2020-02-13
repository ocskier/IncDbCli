INSERT INTO departments(name) VALUES('Human Resources'),('Finance'),('Project Management');
INSERT INTO roles(title,salary,deptId) VALUES('Manager',120000,1),('Accountant',65000,2),('Intern',20000,3);
INSERT INTO employees(first,last,roleId,managerId) VALUES('Jon','Jackson',1,null),('Jimmy','Doe',2,1),('Tim','Nagorski',3,2);