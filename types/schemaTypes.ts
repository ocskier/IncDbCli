export interface IRole {
    id: number;
    title: string;
    salary: number;
    deptId: number;
}

export interface IEmployee {
    id: number;
    first: string;
    last: string;
    roleId: number;
    managerId: number;
}