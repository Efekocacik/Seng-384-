-- Initial database setup for Person Management System

CREATE TABLE IF NOT EXISTS people (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

