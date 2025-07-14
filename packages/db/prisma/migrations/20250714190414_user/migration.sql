-- CreateEnum
CREATE TYPE "Oauth_Type" AS ENUM ('GOOGLE', 'GITHUB');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "oauth_type" "Oauth_Type" NOT NULL,
    "oauth_id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "User_oauth_type_oauth_id_idx" ON "User"("oauth_type", "oauth_id");
