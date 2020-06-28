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
    start()
});

function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            products.push(res[i]);
        }
    });
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
    connection.query("SELECT * FROM products" + x, function (err, res) {
        if (err) throw err;
        console.log("| part_id | product_name | department_name | price | quantity |\n ------------------------------------------------------------");
        for (var i = 0; i < res.length; i++) {
            console.log("| " + res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + " |\n");
        }
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
            for (var i = 0; i < products.length; i++) {
                if (products[i].id == answer.selectProduct) {
                    var updatedInv = parseInt(products[i].stock_quantity) + parseInt(answer.quantity);
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
                            
                        }
                    );
                }
            }
            console.log(" ----Quantity updated!---- \n")
            start()
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
                    console.log(" ----Item has been added!---- \n");
                    start();
                }
            )
        })
}