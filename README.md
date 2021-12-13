# Employee Tracker

[Video Walk-through](https://watch.screencastify.com/v/p4CBghn4DoIt3CABYUlH)

## The Task
- Your assignment this week is to build a command-line application from scratch to manage a company's employee database, using Node.js, Inquirer, and MySQL.

## User Story
- As a business owner, I want to be able to view and manage the departments, roles, and employees in my company, so that I can organize and plan my business.

## Acceptance Criteria
- Given, a command-line application that accepts user input
- When I start the application, then I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role.
- When I choose to view all departments, then I am presented with a formatted table showing department names and department ids.
- When I choose to view all roles, then I am presented with the job title, role id, the department that role belongs to, and the salary for that role.
- When I choose to view all employees, then I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to.
- When I choose to add a department, then I am prompted to enter the name of the department and that department is added to the database.
- When I choose to add a role, then I am prompted to enter the name, salary, and department for the role and that role is added to the database.
- When I choose to add an employee, then I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database.
- When I choose to update an employee role, then I am prompted to select an employee to update and their new role and this information is updated in the database.

## Installation 
- Clone the repository to your local device.
- In the terminal, run npm i to install inquirer, and mysql2.

## Usage
- Run 'node index' in the terminal 
- Feel free to add departments, roles, and employees to your liking. Enjoy!

