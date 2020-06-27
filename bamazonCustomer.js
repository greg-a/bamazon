var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "thisisatest",
    database: "bamazon"
});

var products = [];

connection.connect(function (err) {
    if (err) throw err;
    showInv()
})

function showInv() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("| part_id | product_name | department_name | price | quantity |\n ------------------------------------------------------------");
        for (var i = 0; i < res.length; i++) {
            console.log("| " + res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + " |");
            products.push(res[i]);
        }
    })
}

function purchase() {
    inquirer
        .prompt([
            {
                name: "selectProduct",
                type: "input",
                message: "Enter product ID of the item you would like to purchase"
            },
            {
                name: "quantity",
                type: "input",
                message: "Enter the quantity you would like to purchase"
            }
        ]).then(function(answer) {
            
        })
}