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
    -- CONSTRAINT fk_deptId 
    PRIMARY KEY(id)
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT NOT NULL,
    first VARCHAR(30) NOT NULL,
    last VARCHAR(30) NOT NULL,
    roleId INT NOT NULL,
    managerId INT NOT NULL,
    PRIMARY KEY(id)
);
