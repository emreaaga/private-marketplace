ALTER TABLE "shipments" ADD COLUMN "internal_number" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX "company_shipment_number_idx" ON "shipments" USING btree ("company_id","internal_number");

--> statement-breakpoint
CREATE OR REPLACE FUNCTION set_shipment_internal_number()
RETURNS TRIGGER AS $$
BEGIN
  SELECT COALESCE(MAX(internal_number), 0) + 1
  INTO NEW.internal_number
  FROM "shipments"
  WHERE "company_id" = NEW."company_id";

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--> statement-breakpoint
CREATE TRIGGER trigger_set_internal_number
BEFORE INSERT ON "shipments"
FOR EACH ROW
EXECUTE FUNCTION set_shipment_internal_number();
