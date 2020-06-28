var inquirer = require("inquirer");
var mysql = require("mysql");
const {table} = require('table');

var connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "thisisatest",
    database: "bamazon"
});

var products = [];

connection.connect(function (err) {
    if (err) throw err;
    start()
});

function start() {
    inquirer.prompt(
        {
            name: "menu",
            type: "list",
            message: "Select from menu: ",
            choices: ["View Product Sales by Department", "Create new department", "Exit"]
        }
    ).then(function (answer) {
        switch(answer.menu) {
            
            case "View Product Sales by Department":
                return viewDep();

            case "Create new department":
                return createDep();

            default:
                return connection.end();
        }
    })
}

function viewDep() {
    connection.query("SELECT departments.department_id, departments.department_name, departments.overhead_cost, SUM(products.product_sales) as product_sales FROM departments INNER JOIN products on departments.department_name = products.department_name GROUP BY departments.department_id", function(err, res) {
        if (err) throw err;

        var products = [
            ["department_id", "department_name", "over_head_costs", "product_sales", "total_profit"]
        ];

        for (var i = 0; i < res.length; i++) {
            var tempArray = [];
            tempArray.push(res[i].department_id, res[i].department_name, res[i].overhead_cost, res[i].product_sales, res[i].product_sales - res[i].overhead_cost);

            products.push(tempArray)
        }
        output = table(products);

        console.log(output);
        start()
    })
}

function createDep() {
    inquirer.prompt([
        {
            name: "department",
            type: "input",
            message: "Enter name of new department: "
        },
        {
            name: "cost",
            type: "input",
            message: "Enter overhead cost: "
        }
    ]).then(function(answer) {
        connection.query("INSERT INTO departments SET ?",
        {
            department_name: answer.department,
            overhead_cost: answer.cost
        },
        function (err) {
            if (err) throw err;
            console.log("\n ----" + answer.department + " has been added!---- \n");
            start()
        }
        )
    })
}