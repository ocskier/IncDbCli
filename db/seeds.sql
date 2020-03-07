INSERT INTO departments
    (name)
VALUES('Finance'),
    ('Human Resources'),
    ('Project Management');
INSERT INTO roles
    (title,salary,deptId)
VALUES('Manager', 120000, 2),
    ('Accountant', 65000, 1),
    ('Intern', 20000, 3);
INSERT INTO employees
    (first,last,roleId,managerId)
VALUES('Jon', 'Jackson', 1, null),
    ('Jimmy', 'Doe', 2, 1),
    ('Tim', 'Nagorski', 3, 2);