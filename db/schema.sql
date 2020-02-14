DROP DATABASE IF EXISTS company_db;

CREATE DATABASE company_db;

USE company_db;

CREATE TABLE departments (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR (30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    deptId INT NOT NULL,
    FOREIGN KEY (deptId) REFERENCES departments(id) ON DELETE CASCADE,
    PRIMARY KEY(id)
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT NOT NULL,
    first VARCHAR(30) NOT NULL,
    last VARCHAR(30) NOT NULL,
    roleId INT NOT NULL,
    FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE, 
    managerId INT,
    FOREIGN KEY (managerId) REFERENCES employees(id) ON DELETE SET NULL,
    PRIMARY KEY(id)
);