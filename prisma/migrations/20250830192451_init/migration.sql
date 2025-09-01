-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('CITIZEN', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('RECEIVED', 'IN_PROGRESS', 'RESOLVED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'CITIZEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Complaint" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photoUrl" TEXT,
    "location" TEXT,
    "category" TEXT NOT NULL,
    "severity" INTEGER NOT NULL DEFAULT 1,
    "status" "public"."Status" NOT NULL DEFAULT 'RECEIVED',
    "assignedTo" TEXT,
    "citizenId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Complaint" ADD CONSTRAINT "Complaint_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
