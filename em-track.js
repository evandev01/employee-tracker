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

connection.connect(function(err) {
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
    .then(function(response) {
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
    }})};

function displayEmployees(){
    let query = ("SELECT employee.id,employee.first_name,employee.last_name, role.title AS role , CONCAT(manager.first_name,' ',manager.last_name) AS manager , department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON  employee.manager_id = manager.id")

    connection.query(query, function(err, data){
      if (err) throw err
      console.table(data)
    })
};


let roles;

connection.query("SELECT *FROM roles",function(err,data){

roles=data.map(roles=>{
  return {name:roles.title,value:data.id}
})

inquirer.prompt({
  type:"list",
  name:"roles",
  choices:roles,
  message:"what is the employees role?"
})
})


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

  


