-- DropForeignKey
ALTER TABLE "public"."Snippet" DROP CONSTRAINT "Snippet_userId_fkey";

-- DropIndex
DROP INDEX "public"."Snippet_userId_idx";

-- AlterTable
ALTER TABLE "public"."Snippet" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Snippet" ADD CONSTRAINT "Snippet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
