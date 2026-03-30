DROP INDEX "shipment_order_number_idx";--> statement-breakpoint
DROP INDEX "company_shipment_number_idx";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "internal_number";--> statement-breakpoint
ALTER TABLE "shipments" DROP COLUMN "internal_number";