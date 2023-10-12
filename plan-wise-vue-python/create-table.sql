CREATE TABLE pw_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(256) NOT NULL,
    password VARCHAR(256) NOT NULL,
    name VARCHAR(2048),
    balance NUMERIC DEFAULT 0
);

CREATE TABLE pw_categories (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(1024) NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES pw_users(id)
);

CREATE TABLE pw_income (
    id SERIAL PRIMARY KEY,
    source VARCHAR(1024) NOT NULL,
    amount NUMERIC,
    start_date DATE,
    frequency INTEGER,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES pw_users(id)
);

CREATE TABLE pw_expenses (
    id SERIAL PRIMARY KEY,
    expenses VARCHAR(1024) NOT NULL,
    amount NUMERIC,
    start_date DATE,
    frequency INTEGER,
    category INTEGER,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (category) REFERENCES pw_categories(id),
    FOREIGN KEY (user_id) REFERENCES pw_users(id)
);

CREATE TABLE pw_notes (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    notes VARCHAR(1024),
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES pw_users(id)
);

CREATE TABLE pw_budget_table_income (
    id SERIAL PRIMARY KEY,
    date DATE,
    user_id INTEGER NOT NULL,
    income_id INTEGER,
    source VARCHAR(1024) NOT NULL,
    amount NUMERIC,
    start_date DATE,
    frequency INTEGER,
    FOREIGN KEY (user_id) REFERENCES pw_users(id)
);

CREATE TABLE pw_budget_table_expense (
    id SERIAL PRIMARY KEY,
    date DATE,
    user_id INTEGER NOT NULL,
    expense_id INTEGER,
    expenses VARCHAR(1024) NOT NULL,
    amount NUMERIC,
    start_date DATE,
    frequency INTEGER,
    category INTEGER,
    FOREIGN KEY (user_id) REFERENCES pw_users(id),
    FOREIGN KEY (category) REFERENCES pw_categories(id)
);
