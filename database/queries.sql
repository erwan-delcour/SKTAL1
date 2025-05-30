CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    login VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user' NOT NULL
);

INSERT INTO users (email, login, password, role) VALUES 
('user@example.com', 'username', '$2b$10$cMIWLjsU9aVp29H5AjeNau.hnClnZ6CBnTPSrSF850I/GQFWh1BIG', 'user'),
('manager@example.com', 'manager', '$2b$10$ZWn8ZgOsSO61ozb2UKb5g.EMQBRdmEedl2hByo6Ld6x7tyNaFhpK6', 'manager'),
('secretary@example.com', 'secretary', '$2b$10$DPFeMchkrRhrnd/PbXZFY.LK1wxsR9D0pF3RcDGG7Hai56JHSalAi', 'secretary');

CREATE TABLE places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    isAvailable BOOLEAN NOT NULL DEFAULT TRUE,
    hasCharger BOOLEAN NOT NULL,
    row TEXT NOT NULL,
    spotNumber TEXT NOT NULL
);

INSERT INTO places (row, spotNumber, hascharger) VALUES
('A', '01', TRUE),
('A', '02', TRUE),
('A', '03', TRUE),
('A', '04', TRUE),
('A', '05', TRUE),
('A', '06', TRUE),
('A', '07', TRUE),
('A', '08', TRUE),
('A', '09', TRUE),
('A', '10', TRUE),
('B', '01', FALSE),
('B', '02', FALSE),
('B', '03', FALSE),
('B', '04', FALSE),
('B', '05', FALSE),
('B', '06', FALSE),
('B', '07', FALSE),
('B', '08', FALSE),
('B', '09', FALSE),
('B', '10', FALSE),
('C', '01', FALSE),
('C', '02', FALSE),
('C', '03', FALSE),
('C', '04', FALSE),
('C', '05', FALSE),
('C', '06', FALSE),
('C', '07', FALSE),
('C', '08', FALSE),
('C', '09', FALSE),
('C', '10', FALSE),
('D', '01', FALSE),
('D', '02', FALSE),
('D', '03', FALSE),
('D', '04', FALSE),
('D', '05', FALSE),
('D', '06', FALSE),
('D', '07', FALSE),
('D', '08', FALSE),
('D', '09', FALSE),
('D', '10', FALSE),
('E', '01', FALSE),
('E', '02', FALSE),
('E', '03', FALSE),
('E', '04', FALSE),
('E', '05', FALSE),
('E', '06', FALSE),
('E', '07', FALSE),
('E', '08', FALSE),
('E', '09', FALSE),
('E', '10', FALSE),
('F', '01', TRUE),
('F', '02', TRUE),
('F', '03', TRUE),
('F', '04', TRUE),
('F', '05', TRUE),
('F', '06', TRUE),
('F', '07', TRUE),
('F', '08', TRUE),
('F', '09', TRUE),
('F', '10', TRUE);

create table reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID NOT NULL,
    spotId UUID NOT NULL,
    needsCharger BOOLEAN NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    statusChecked BOOLEAN NOT NULL DEFAULT FALSE,
    checkInTime TIMESTAMP WITH TIME ZONE,
    Foreign Key (userId) REFERENCES users(id),
    Foreign Key (spotId) REFERENCES places(id)
);

BEGIN;
WITH
  chosen_user AS (
    SELECT id AS user_id FROM users LIMIT 1
  ),
  chosen_spot AS (
    SELECT id AS spot_id FROM places LIMIT 1
  )
INSERT INTO reservations (userId, spotId, startDate, endDate, needsCharger)
SELECT user_id, spot_id, NOW(), NOW() + INTERVAL '1 hour', FALSE
FROM chosen_user, chosen_spot;

COMMIT;