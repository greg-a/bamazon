var inquirer = require("inquirer");
var mysql = require("mysql");
const { table } = require('table');

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
        .then(function (answer) {
            switch (answer.menu) {

                case "View All Inventory":
                    return showInv("");

                case "View Low Inventory":
                    return showInv(" WHERE stock_quantity < 5");

                case "Add Inventory":
                    return addInv();

                case "Add New Product":
                    return newItem();

                default:
                    return connection.end();
            }
        })
}

function showInv(x) {
    var products = [
        ["part_id", "product_name", "department_name", "price", "quantity"]
    ];
    connection.query("SELECT * FROM products" + x, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            var tempArray = [];
            tempArray.push(res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity);

            products.push(tempArray)
        }

        output = table(products);

        console.log(output);
        start();
    })
}

function addInv() {
    inquirer
        .prompt([
            {
                name: "selectProduct",
                type: "input",
                message: "Enter product ID of the item you would like to update: "
            },
            {
                name: "quantity",
                type: "input",
                message: "Enter the quantity you would like to add: "
            }
        ]).then(function (answer) {
            connection.query("SELECT * FROM products WHERE id = ?", [answer.selectProduct], function (err, res) {
                if (err) throw err;
                var tempProduct = res;
                var updatedInv = parseInt(res[0].stock_quantity) + parseInt(answer.quantity);

                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: updatedInv
                        },
                        {
                            id: answer.selectProduct
                        }
                    ],
                    function (error) {
                        if (error) throw error;
                        console.log(" ----Quantity updated!---- \n");
                        start()
                    }
                );


            });

        })
}

function newItem() {
    inquirer.prompt([
        {
            name: "itemName",
            type: "input",
            message: "Enter item name to be added: "
        },
        {
            name: "department",
            type: "input",
            message: "Enter department for item: "
        },
        {
            name: "price",
            type: "input",
            message: "Enter price of item: "
        },
        {
            name: "quantity",
            type: "input",
            message: "Enter quantity of item: "
        }
    ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.itemName,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.quantity
                },
                function (err) {
                    if (err) throw err;
                    console.log("\n ----" + answer.itemName + " has been added!---- \n");
                    start();
                }
            )
        })
}