/*
  Warnings:

  - You are about to drop the column `description` on the `Tweet` table. All the data in the column will be lost.
  - You are about to drop the column `from` on the `User` table. All the data in the column will be lost.
  - Added the required column `content` to the `Tweet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tweet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "content" TEXT NOT NULL,
    "img" TEXT,
    "userId" INTEGER,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Tweet" ("id", "createdAt", "updatedAt", "img", "userId") SELECT "id", "createdAt", "updatedAt", "img", "userId" FROM "Tweet";
DROP TABLE "Tweet";
ALTER TABLE "new_Tweet" RENAME TO "Tweet";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "desc" TEXT,
    "city" TEXT,
    "profilePicture" TEXT DEFAULT '',
    "coverPicture" TEXT DEFAULT ''
);
INSERT INTO "new_User" ("id", "createdAt", "updatedAt", "email", "username", "password", "desc", "city", "profilePicture", "coverPicture") SELECT "id", "createdAt", "updatedAt", "email", "username", "password", "desc", "city", "profilePicture", "coverPicture" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");
CREATE UNIQUE INDEX "User.username_unique" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
