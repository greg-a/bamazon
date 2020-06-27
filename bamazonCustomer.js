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
    showInv();
  
})

function showInv() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("| part_id | product_name | department_name | price | quantity |\n ------------------------------------------------------------");
        for (var i = 0; i < res.length; i++) {
            console.log("| " + res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + " |");
            products.push(res[i]);
        }
        purchase();
    })
}

function purchase() {
    inquirer
        .prompt([
            {
                name: "selectProduct",
                type: "input",
                message: "Enter product ID of the item you would like to purchase: "
            },
            {
                name: "quantity",
                type: "input",
                message: "Enter the quantity you would like to purchase: "
            }
        ]).then(function (answer) {
            for (var i = 0; i < products.length; i++) {
                if (products[i].id == answer.selectProduct) {
                    var selectedItem = products[i];
                    var qtyCheck = products[i].stock_quantity - answer.quantity;
                    if (qtyCheck >= 0) {
                        connection.query("UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: qtyCheck
                                },
                                {
                                    id: answer.selectProduct
                                }
                            ],
                            function (error) {                                
                                if (error) throw error;

                                var totalPrice = parseInt(answer.quantity) * parseFloat(selectedItem.price);

                                console.log(answer.quantity + " " + selectedItem.product_name + "(s) have been purchased for a total of " + "$" + (Math.round(totalPrice * 100) / 100).toFixed(2) + "!")
                            }
                        );
                        showInv();
                    }
                    else {
                        console.log("Insufficient inventory!");
                        purchase()
                    }
                }
            }
        })
}