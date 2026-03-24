ALTER TABLE "orders" ADD COLUMN "internal_number" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX "shipment_order_number_idx" ON "orders" USING btree ("shipment_id","internal_number");

--> statement-breakpoint
CREATE OR REPLACE FUNCTION set_order_internal_number()
RETURNS TRIGGER AS $$
BEGIN
  SELECT COALESCE(MAX(internal_number), 0) + 1
  INTO NEW.internal_number
  FROM "orders"
  WHERE "shipment_id" = NEW."shipment_id";

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--> statement-breakpoint
CREATE TRIGGER trigger_set_order_internal_number
BEFORE INSERT ON "orders"
FOR EACH ROW
EXECUTE FUNCTION set_order_internal_number();
