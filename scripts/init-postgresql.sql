-- Created PostgreSQL initialization script
-- This script will be automatically executed to set up the database tables

-- Create users table
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'CITIZEN',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create complaints table
CREATE TABLE IF NOT EXISTS "Complaint" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    "photoUrl" VARCHAR(500),
    location VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    severity INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'RECEIVED',
    "assignedTo" VARCHAR(255),
    "citizenId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("citizenId") REFERENCES "User"(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_complaint_citizen ON "Complaint"("citizenId");
CREATE INDEX IF NOT EXISTS idx_complaint_status ON "Complaint"(status);
CREATE INDEX IF NOT EXISTS idx_complaint_category ON "Complaint"(category);
