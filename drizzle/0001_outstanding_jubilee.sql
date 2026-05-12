ALTER TABLE "users" ADD COLUMN "public_id" varchar(10);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_public_id_unique" UNIQUE("public_id");