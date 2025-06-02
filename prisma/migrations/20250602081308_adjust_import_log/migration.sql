-- CreateEnum
CREATE TYPE "ImportLogStatus" AS ENUM ('SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "import_file" ADD COLUMN     "total_records" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "import_log" ADD COLUMN     "product_index" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "ImportLogStatus" NOT NULL DEFAULT 'SUCCESS';
