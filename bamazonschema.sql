DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

use bamazon;
create table products (
	id INTEGER AUTO_INCREMENT,
    product_name varchar(100) NOT NULL,
    department_name varchar(100) NOT NULL,
    price DECIMAL(10,4) not null,
    stock_quantity INTEGER not null,
    PRIMARY KEY (id)
)