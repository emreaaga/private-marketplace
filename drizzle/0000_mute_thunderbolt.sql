CREATE TYPE "public"."passport_status" AS ENUM('active', 'limit_reached', 'expired', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."client_status" AS ENUM('active', 'blocked', 'pending');--> statement-breakpoint
CREATE TYPE "public"."company_type" AS ENUM('platform', 'postal', 'air_partner', 'customs_broker');--> statement-breakpoint
CREATE TYPE "public"."financial_event_type" AS ENUM('payment', 'prepayment', 'additional', 'penalty', 'adjustment', 'refund');--> statement-breakpoint
CREATE TYPE "public"."flight_expense_type" AS ENUM('aircraft', 'customs', 'handling', 'other');--> statement-breakpoint
CREATE TYPE "public"."flight_status" AS ENUM('planned', 'departed', 'arrived', 'closed');--> statement-breakpoint
CREATE TYPE "public"."order_item_category" AS ENUM('clothes', 'electronics');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('received', 'in_flight', 'arrived', 'delivered', 'closed');--> statement-breakpoint
CREATE TYPE "public"."pricing_type" AS ENUM('per_kg', 'fixed', 'per_item');--> statement-breakpoint
CREATE TYPE "public"."service_type" AS ENUM('flight', 'customs', 'delivery', 'marketing', 'penalty');--> statement-breakpoint
CREATE TYPE "public"."shipment_status" AS ENUM('draft', 'ready', 'in_flight', 'arrived', 'closed');--> statement-breakpoint
CREATE TYPE "public"."trip_stop_status" AS ENUM('created', 'pending', 'delivered');--> statement-breakpoint
CREATE TYPE "public"."trip_status" AS ENUM('created', 'on_way', 'completed');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'company_owner', 'employee');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'blocked', 'pending');--> statement-breakpoint
CREATE TABLE "branches" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "branches_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"company_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"country" varchar(2) NOT NULL,
	"city" varchar(3) NOT NULL,
	"is_main" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_passports" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "client_passports_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"client_id" integer NOT NULL,
	"passport_number" varchar(50) NOT NULL,
	"national_id" varchar(20) NOT NULL,
	"country" varchar(2) NOT NULL,
	"issued_at" timestamp,
	"expires_at" timestamp,
	"status" "passport_status" DEFAULT 'active' NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "clients_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"surname" varchar(255) NOT NULL,
	"email" varchar(255),
	"status" "client_status" DEFAULT 'active' NOT NULL,
	"country" varchar(2) NOT NULL,
	"city" varchar(3) NOT NULL,
	"district" varchar(50) NOT NULL,
	"address_line" varchar(255),
	"phone_country_code" varchar(5) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "companies_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" varchar(10),
	"name" varchar(255) NOT NULL,
	"type" "company_type" NOT NULL,
	"country" varchar(2) NOT NULL,
	"city" varchar(3) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "companies_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE "financial_events" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "financial_events_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"order_id" integer,
	"shipment_id" integer,
	"flight_id" integer,
	"type" "financial_event_type" NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flight_expenses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "flight_expenses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"flight_id" integer NOT NULL,
	"type" "flight_expense_type" NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flights" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "flights_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"from_country" varchar(2) NOT NULL,
	"from_city" varchar(3) NOT NULL,
	"to_country" varchar(2) NOT NULL,
	"to_city" varchar(3) NOT NULL,
	"air_partner_id" integer NOT NULL,
	"sender_customs_id" integer NOT NULL,
	"receiver_customs_id" integer NOT NULL,
	"air_kg_price" numeric(8, 2) NOT NULL,
	"sender_customs_kg_price" numeric(8, 2) NOT NULL,
	"receiver_customs_kg_price" numeric(8, 2) NOT NULL,
	"loading_at" timestamp,
	"departure_at" timestamp,
	"arrival_at" timestamp,
	"unloading_at" timestamp,
	"awb_number" varchar(64),
	"final_gross_weight_kg" numeric(10, 2),
	"status" "flight_status" DEFAULT 'planned' NOT NULL,
	"is_paid" boolean DEFAULT false NOT NULL,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "order_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"order_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" "order_item_category",
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "orders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"trip_id" integer,
	"destination_branch_id" integer,
	"company_id" integer NOT NULL,
	"shipment_id" integer NOT NULL,
	"sender_id" integer NOT NULL,
	"receiver_id" integer NOT NULL,
	"service_id" integer,
	"to_country" varchar(2) NOT NULL,
	"to_city" varchar(3) NOT NULL,
	"weight_kg" numeric(8, 2) NOT NULL,
	"extra_fee" numeric(10, 2),
	"rate_per_kg" numeric(8, 2) NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"prepaid_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"status" "order_status" DEFAULT 'received' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "services_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"company_id" integer NOT NULL,
	"type" "service_type" NOT NULL,
	"pricing_type" "pricing_type" NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "shipments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"company_id" integer NOT NULL,
	"flight_id" integer,
	"from_country" varchar(2) NOT NULL,
	"to_country" varchar(2) NOT NULL,
	"status" "shipment_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trip_stops" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "trip_stops_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"trip_id" integer NOT NULL,
	"branch_id" integer NOT NULL,
	"stop_order" integer NOT NULL,
	"status" "trip_stop_status" DEFAULT 'created' NOT NULL,
	"arrived_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "trips_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"flight_id" integer,
	"company_id" integer NOT NULL,
	"status" "trip_status" DEFAULT 'created' NOT NULL,
	"departure_at" timestamp,
	"arrival_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"company_id" integer NOT NULL,
	"branch_id" integer,
	"name" varchar(100) NOT NULL,
	"surname" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'company_owner' NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"country" varchar(2) NOT NULL,
	"city" varchar(3) NOT NULL,
	"district" varchar(50) NOT NULL,
	"address_line" varchar(255),
	"phone_country_code" varchar(5) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "branches" ADD CONSTRAINT "branches_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_passports" ADD CONSTRAINT "client_passports_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_events" ADD CONSTRAINT "financial_events_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_events" ADD CONSTRAINT "financial_events_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_events" ADD CONSTRAINT "financial_events_flight_id_flights_id_fk" FOREIGN KEY ("flight_id") REFERENCES "public"."flights"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flight_expenses" ADD CONSTRAINT "flight_expenses_flight_id_flights_id_fk" FOREIGN KEY ("flight_id") REFERENCES "public"."flights"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flights" ADD CONSTRAINT "flights_air_partner_id_companies_id_fk" FOREIGN KEY ("air_partner_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flights" ADD CONSTRAINT "flights_sender_customs_id_companies_id_fk" FOREIGN KEY ("sender_customs_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flights" ADD CONSTRAINT "flights_receiver_customs_id_companies_id_fk" FOREIGN KEY ("receiver_customs_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_destination_branch_id_branches_id_fk" FOREIGN KEY ("destination_branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_sender_id_clients_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_receiver_id_clients_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_flight_id_flights_id_fk" FOREIGN KEY ("flight_id") REFERENCES "public"."flights"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "passport_country_unique" ON "client_passports" USING btree ("country","passport_number");--> statement-breakpoint
CREATE UNIQUE INDEX "national_id_unique" ON "client_passports" USING btree ("national_id");