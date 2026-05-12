ALTER TABLE "clients" ADD COLUMN "public_id" varchar(10);--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_public_id_unique" UNIQUE("public_id");