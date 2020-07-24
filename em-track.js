var mysql = require("mysql");
var express = require("express");
var inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_tracker_db"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected as id " + connection.threadId);
  init();
});


//Start prompt

function init() {
  inquirer.prompt({
    type: "list",
    name: "start",
    message: "What would you like to do?",
    choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager",
      "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager"]
  })
    .then(function (response) {
      switch (response.start) {

        case "View All Employees":
          displayEmployees();
          break;

        case "View All Employees By Department":
          displayEmByDep();
          break;

        case "View All Employees By Manager":
          displayEmByManager();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Update Employee Role":
          updateEmpRole();
          break;

        case "Update Employee Manager":
          updateEmpManager();
          break;
      }
    })
};

//function to display all employees//
function displayEmployees() {
  let query = ("SELECT employee.id,employee.first_name,employee.last_name, role.title AS role , CONCAT(manager.first_name,' ',manager.last_name) AS manager , department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON  employee.manager_id = manager.id")

  connection.query(query, function (err, data) {
    if (err) throw err
    console.table(data)
    init();
  })
};

//function to display employees by department//
function displayEmByDep() {
  let query1 = ("SELECT * FROM department");

  connection.query(query1, function (err, response) {
    if (err) throw err
    const departments = response.map(function (element) {
      return {
        name: `${element.name}`
      }
    })

    inquirer.prompt([{
      type: "list",
      name: "dept",
      message: "Please select a department to view employees",
      choices: departments

    }]).then(function (answer) {
      let query2 = `SELECT employee.first_name, employee.last_name, employee.role_id AS role, CONCAT(manager.first_name,' ',manager.last_name) AS manager, department.name as department 
      FROM employee LEFT JOIN role on employee.role_id = role.id 
      LEFT JOIN department ON role.department_id =department.id LEFT JOIN employee manager ON employee.manager_id=manager.id
      WHERE ?`
      connection.query(query2, [{ name: answer.dept }], function (err, res) {
        if (err) throw err
        console.table(res)
        init();
      })
    })
  })
}

//   const departments = response.map(function (element){
//     return 
// }

// inquirer.prompt({
//   type: "list",
//   name: "dept",
//   message: "Please select department to view employees",
//   choices: departments
// })
// let query2 = ("SELECT employee.id, employee.first_name, employee.last_name, ")


// get list of employees from employee table
// ask user which employee they'd like to update
// get list of roles from the role table
// update employe set role = new rold_id where id = selected_employee_id

function updateEmpRole() {
  let query = ("select * from employee");

  connection.query(query, function (err, response) {

    const employees = response.map(function (element) {
      return {
        name: `${element.first_name} ${element.last_name}`,
        value: element.id
      }
    })

    //console.log(employees)
    inquirer.prompt([{
      type: "list",
      name: "employeeId",
      message: "Which employees role do you want to update",
      choices: employees
    }]).then(function (input1) {

      connection.query("select * from role", function (err, data) {

        const roles = data.map(function (role) {
          return {
            name: role.title,
            value: role.id
          }
        })

        inquirer.prompt([{
          type: "list",
          name: "roleId",
          message: "What's the new role",
          choices: roles
        }]).then(function (input2) {

          console.log("Update employee set role_id=" + input2.roleId + " where id=" + input1.employeeId)
        })
      })

    })

  })

}
  // connection.query("SELECT *FROM role", function (err, data) {
  //   roles = data.map(roles => {
  //     return { name: roles.title, value: data.id }
  //   })
  //   inquirer.prompt({
  //     type: "list",
  //     name: "roles",
  //     choices: roles,
  //     message: "What is the employee's current role?"
  //   })
  // })
  //   .then(function (response) {
  //     let roleEm;
  //     let query = ("SELECT employee.first_name, employee.last_name, role.title AS role")
  //     query += ("LEFT JOIN employee ON response = role.title")
  //     if (response === "role.title"){
  //       connection.query(query, function(err, data){
  //         if (err) throw err;
  //         return (data)
  //         })
  //         console.table(data);
  //   }})

  //     };

  // get list of employees from employee table
  // ask user which employee they'd like to update
  // get list of roles from the role table
  // update employe set role = new rold_id where id = selected_employee_id

// let employees;
// connection.query("SELECT * FROM employee", function (err, data) {
//   employees = data.map(employees => {
//     return {name: employees.first_name + " " + employees.last_name}
//   })
//   inquirer.prompt({
//     type: "list",
//     name: "emList",
//     choices: employees,
//     message: "Please select employee to update role"
//   })
//   console.table(employees);
// })

// function displayEmByDep(list){
//     var query = "INNER JOIN department.name, employee.first_name, employee.last_name";
//     connection.query(query, function (err, res){
//       if (err) throw err
//       console.log(list)
//     })
// }

// function displayEmByManager(){
//     connection.query(SELECT * FROM employee WHERE )
// }

// function addEmployee(answer){
//     let query = "INSERT INTO employee first_name, last_name, role_id, manager_id";
//     query += "VALUES answer.first_name, answer.last_name";
//     connection.query(query, function(err, res){
//       if (err) throw err
//       console.log("success")
//     })};

// function removeEmployee(){
//     connection.query()
// }

// function updateEmpRole(){
//     connection.query()
// }

// function updateEmpManager(){
//     connection.query()
// }