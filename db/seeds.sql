INSERT INTO departments (name) VALUES
    ('Inventory'), ('Sales'), ('Development'), ('Financial');

INSERT INTO roles (title, salary, department_id) VALUES
    ('Inventory Manager', 100000, 1),
    ('Warehouse', 60000, 1),
    ('Salesman', 80000, 2),
    ('Lead Developer', 120000, 3),
    ('Web Developer', 80000, 3),
    ('Financial Advisor', 200000, 4),
    ('Accountant', 90000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
    ('Henry', 'Danger', 1, NULL),
    ('Jeffrey', 'Clinton', 2, 1),
    ('Ronald', 'McDonald', 2, 1),
    ('Quintarious', 'Jones', 2, 1),
    ('Jack', 'Sparrow', 3, NULL),
    ('Darth','Yoda', 3, NULL),
    ('Pooh', 'Winnie', 4, NULL),
    ('Spider', 'Man', 5, 7),
    ('Jesus', 'Christ', 5, 7),
    ('Jake', 'Paul', 6, NULL),
    ('Florence', 'Mayweather', 7, 10),
    ('Alli', 'Brock', 7, 10);