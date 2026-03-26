ALTER TABLE "orders" ALTER COLUMN "destination_branch_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "to_country" varchar(2) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "to_city" varchar(3) NOT NULL;