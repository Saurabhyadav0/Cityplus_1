-- Create tables for Neon PostgreSQL database
-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS "Complaint" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TYPE IF EXISTS "Role" CASCADE;
DROP TYPE IF EXISTS "Status" CASCADE;

-- Create enums
CREATE TYPE "Role" AS ENUM ('CITIZEN', 'ADMIN');
CREATE TYPE "Status" AS ENUM ('RECEIVED', 'IN_PROGRESS', 'RESOLVED');

-- Create User table
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CITIZEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Complaint table
CREATE TABLE "Complaint" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photoUrl" TEXT,
    "location" TEXT,
    "category" TEXT NOT NULL,
    "severity" INTEGER NOT NULL DEFAULT 1,
    "status" "Status" NOT NULL DEFAULT 'RECEIVED',
    "assignedTo" TEXT,
    "citizenId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Complaint_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create indexes for better performance
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "Complaint_citizenId_idx" ON "Complaint"("citizenId");
CREATE INDEX "Complaint_status_idx" ON "Complaint"("status");
CREATE INDEX "Complaint_category_idx" ON "Complaint"("category");

-- Insert a test admin user (password: admin123)
INSERT INTO "User" ("name", "email", "password", "role") 
VALUES ('Admin User', 'admin@cityfix.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', 'ADMIN');

console.log('[v0] Database tables created successfully');
