/*
  Warnings:

  - You are about to drop the column `author_id` on the `comment` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `comment` table without a default value. This is not possible if the table is not empty.

*/

-- AlterTable
ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "fk_comment_user";

-- AlterTable
ALTER TABLE "comment" DROP COLUMN "author_id",
ADD COLUMN     "user_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "import_file" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_import_file" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_log" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "file_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_import_log" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "fk_comment_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_log" ADD CONSTRAINT "fk_import_log_import_file" FOREIGN KEY ("file_id") REFERENCES "import_file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
