USE bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Bowflex Adjustable Dumbbell', 'Exercise', 499.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Intertube', 'Recreation', 39.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Nike Pegasus', 'Exercise', 99.99, 500);

INSERT INTO departments (department_name, overhead_cost)
VALUES ('Exercise', 10000);

INSERT INTO departments (department_name, overhead_cost)
VALUES ('Recreation', 5000);

INSERT INTO departments (department_name, overhead_cost)
VALUES ('Sports Apparel', 800);