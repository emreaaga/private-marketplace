ALTER TABLE "companies" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."company_type";--> statement-breakpoint
CREATE TYPE "public"."company_type" AS ENUM('platform', 'postal', 'air_partner', 'customs_broker');--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "type" SET DATA TYPE "public"."company_type" USING "type"::"public"."company_type";