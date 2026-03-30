ALTER TABLE "trips" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "trips" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "trips_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "trips" ADD COLUMN "flight_id" integer;