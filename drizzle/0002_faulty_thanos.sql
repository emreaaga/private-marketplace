CREATE TYPE "public"."client_status" AS ENUM('active', 'blocked', 'pending');--> statement-breakpoint
CREATE TYPE "public"."passport_status" AS ENUM('active', 'limit_reached', 'expired', 'blocked');--> statement-breakpoint
ALTER TYPE "public"."status" RENAME TO "user_status";--> statement-breakpoint
CREATE TABLE "client_passports" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "client_passports_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"client_id" integer NOT NULL,
	"passport_number" varchar(50) NOT NULL,
	"country" varchar(2) NOT NULL,
	"issued_at" timestamp,
	"expires_at" timestamp,
	"status" "passport_status" DEFAULT 'active' NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clients" RENAME COLUMN "phone" TO "phone_number";--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "status" "client_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "city" varchar(3) NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "district" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "address_line" varchar(255);--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "phone_country_code" varchar(5) NOT NULL;--> statement-breakpoint
ALTER TABLE "client_passports" ADD CONSTRAINT "client_passports_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;