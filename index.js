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

function addRole(){
    db.query('select * from departments', (err, result)=>{
        if (err){
            console.log(err);
            return firstPrompt();
        }
        let departmentList = [];
        for (let i = 0; i < result.length; i++){
            departmentList.push(result[i].name);
        }
        inq.prompt([
            {
                type: 'input',
                name: 'role',
                message: 'What is the new Role?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of this role?'
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which Department does this Role belong to?',
                choices: departmentList
            }
        ])
        .then(answer =>{
            let role = answer.role.replace(/\s+/g, '_');
            let target = null;
            for (let i = 0; i < result.length; i++){
                if (answer.department === result[i].name){
                    target = result[i].id;
                    break;
                }
            }
            if (target !== null){
                let params = [answer.role, answer.salary, target];
                const sql = 'insert into roles (title, salary, department_id) values (?, ?, ?)';
                db.query(sql, params, (err, result)=>{
                    if (err){
                        console.log(err);
                        return firstPrompt();
                    }
                    console.log(`Added ${role} to the Roles!`);
                    return firstPrompt();
                })
            }
            else{
                console.log('Department not found!');
                return firstPrompt();
            }
        })
    })
}

function addEmployee(){
    db.query('select id, first_name, last_name from employees where manager_id is null', (err, managerResult)=>{
        let managerList = [];
        for (let i = 0; i < managerResult.length; i++){
            managerList.push(managerResult[i].first_name + ' ' + managerResult[i].last_name);
        }
        managerList.push('No Manager');
        db.query("select * from roles", (err, roleResult)=>{
            let roleNames = [];
            for (i = 0; i < roleResult.length; i++){
                roleNames.push(roleResult[i].title);
            }
            inq.prompt([
                {
                    type: 'input',
                    name: 'first',
                    message: "What is the employee's first name?"
                },
                {
                    type: 'input',
                    name: 'last',
                    message: "What is the employee's last name?"
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "What is this Employee's Role?",
                    choices: roleNames
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Who is this Employee's Manager?",
                    choices: managerList
                }
            ])
            .then(answer =>{
                let managerTarget = -1;
                let roleTarget = null;
                let manFirst = answer.manager.split(' ');
                let manLast = manFirst[1];
                manFirst = manFirst[0];
                if ((manFirst !== 'No') && (manLast !== 'Manager')){
                    for (i = 0; i < managerResult.length; i++){
                        if ((manFirst === managerResult[i].first_name) && (manLast === managerResult[i].last_name)){
                            managerTarget = managerResult[i].id;
                            break;
                        }
                    }
                }
                else managerTarget = null; 
                for (i = 0; i < roleResult.length; i++){
                    if (roleResult[i].title === answer.role){
                        roleTarget = roleResult[i].id;
                        break;
                    }
                }
                if ((managerTarget !== -1) && (roleTarget !== null)){
                    let first = answer.first.replace(/\s+/g, '_');
                    let last = answer.last.replace(/\s+/g, '_');
                    const params = [first, last, roleTarget, managerTarget];
                    const sql = 'insert into employees (first_name, last_name, role_id, manager_id) values (?,?,?,?)';
                    db.query(sql, params, (err, result)=>{
                        if (err){
                            console.log(err);
                            return firstPrompt();
                        }
                        console.log(`Added ${first} to the list of Employees!`);
                        return firstPrompt();
                    })
                }
                else{
                    console.log('Manager or Role does not exist!');
                    return firstPrompt();
                }
            })
        })
    })
}

function updateEmployeeRole(){
    db.query('select * from employees', (err, employeeResult)=>{
        let employeeNames = [];
        for (let i = 0; i < employeeResult.length; i++){
            employeeNames.push(employeeResult[i].first_name + ' ' + employeeResult[i].last_name);
        }
        db.query('select * from roles', (err, roleResult)=>{
            let roleList = [];
            for (i = 0; i < roleResult.length; i++) roleList.push(roleResult[i].title);
            inq.prompt([
                {
                    type: 'list',
                    name: 'name',
                    message: 'Which Employee would you like to change?',
                    choices: employeeNames
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the new role for this employee?',
                    choices: roleList 
                }
            ])
            .then(answer =>{
                let employeeTarget = null;
                let roleTarget = null;
                let first = answer.name.split(' ');
                let last = first[1];
                first = first[0];
                for (i = 0; i < employeeResult.length; i++){
                    if ((employeeResult[i].first_name === first) && (employeeResult[i].last_name === last)){
                        employeeTarget = employeeResult[i].id;
                        break;
                    }
                }
                for (i = 0; i < roleResult.length; i++){
                    if (roleResult[i].title === answer.role){
                        roleTarget = roleResult[i].id;
                        break;
                    }
                }
                if ((employeeTarget !== null) && (roleTarget !== null)){
                    const params = [roleTarget, employeeTarget];
                    db.query("update employees set role_id = ? where id = ?", params, (err, result)=>{
                        if (err){
                            console.log(err);
                            return firstPrompt();
                        }
                        console.log(`${first}'s Role was updated!`);
                        return firstPrompt();
                    })
                }
                else{
                    console.log('Employee or Role does not exist!');
                    return firstPrompt();
                }
            })
        })
    })
}

firstPrompt();