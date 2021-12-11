const inq = require('inquirer');
const db = require('./db/connection.js');

function firstPrompt(){
    inq.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees','Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Exit']
    })
    .then((answer)=>{
        let sql;
        if (answer.action === 'View All Departments'){
            sql = "select departments.id as 'ID', departments.name as 'Department' from departments";
            makeTable(sql, null);
        }
        else if (answer.action === 'View All Roles'){
            sql = "select roles.id as 'ID', roles.title as 'Job Title', roles.salary as 'Salary'," + "departments.name as 'Department' from roles " + "left join departments on roles.department_id = departments.id";
            makeTable(sql, null);
        }
        else if (answer.action === 'View All Employees'){
            sql = "select s1.id as 'ID', s1.first_name as 'First Name', s1.last_name as 'Last Name'," +
            "roles.title as 'Job Title', departments.name as 'Department'," +
            "(CONCAT(s2.first_name,' ',s2.last_name)) as 'Manager Name', roles.salary as 'Salary' " +
            "from employees s1 " +
            "left join roles on s1.role_id = roles.id " +
            "left join employees s2 on s1.manager_id = s2.id " + 
            "left join departments on roles.department_id = departments.id";
            makeTable(sql, null);
        }
        else if (answer.action === 'Add a Department'){
            addDepartment();
        }
        else if (answer.action === 'Add a Role'){
            addRole();
        }
        else if (answer.action === 'Add an Employee'){
            addEmployee();
        }
        else if (answer.action === 'Update an Employee Role'){
            updateEmployeeRole();
        }
        else if (answer.action === 'Exit'){
            return console.log('Goodbye!');
        }
    })
}

function makeTable(query, param){
    db.query(query, param, (err, result) =>{
        if (err){
            console.log(err);
            return firstPrompt();
        }
        console.table(result);
        return firstPrompt();
    })
}

function addDepartment(){
    inq.prompt({
        type: 'input',
        name: 'department',
        message: 'What is the new department name?'
    })
    .then(answer =>{
        let department = answer.department.replace(/\s+/g, '_');
        const sql = 'insert into departments (name) values (?)';
        db.query(sql, department, (err, result)=>{
            if (err){
                console.log(err);
                return firstPrompt();
            }
            console.log(`Added ${department} to Departments!`);
            return firstPrompt();
        })
    })
}

firstPrompt();