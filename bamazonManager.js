var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "thisisatest",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    start()
});

function start() {
    inquirer.prompt({
        name: "menu",
        type: "list",
        message: "What would you like to do?",
        choices: ["View All Inventory", "View Low Inventory", "Add Inventory", "Add New Product", "Exit"]
    })
    .then(function (answer){
        switch (answer.menu) {

            case "View All Inventory":
                return showInv("");

            case "View Low Inventory":
                return showInv(" WHERE stock_quantity < 5");

            case "Add Inventory":
                return;

            case "Add New Product":
                return;

            default:
                return connection.end();
        }
    })
}

function showInv(x) {
    connection.query("SELECT * FROM products" + x, function (err, res) {
        if (err) throw err;
        console.log("| part_id | product_name | department_name | price | quantity |\n ------------------------------------------------------------");
        for (var i = 0; i < res.length; i++) {
            console.log("| " + res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + " |\n");
        }
        start();
    })
}