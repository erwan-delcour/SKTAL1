CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    login VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user' NOT NULL
);


INSERT INTO users (email, login, password)
VALUES ('user@example.com', 'username', '$2b$10$cMIWLjsU9aVp29H5AjeNau.hnClnZ6CBnTPSrSF850I/GQFWh1BIG');
