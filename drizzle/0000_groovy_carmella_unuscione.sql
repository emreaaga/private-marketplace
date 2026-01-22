CREATE TYPE "public"."role" AS ENUM('admin', 'company_owner');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'blocked', 'pending');--> statement-breakpoint
CREATE TYPE "public"."company_type" AS ENUM('platform', 'postal', 'air_partner', 'customs_broker');--> statement-breakpoint
CREATE TYPE "public"."pricing_type" AS ENUM('per_kg', 'fixed', 'per_item');--> statement-breakpoint
CREATE TYPE "public"."service_type" AS ENUM('flight', 'customs', 'delivery', 'marketing', 'penalty');--> statement-breakpoint
CREATE TYPE "public"."dispatch_status" AS ENUM('draft', 'ready', 'in_flight', 'arrived', 'closed');--> statement-breakpoint
CREATE TYPE "public"."flight_status" AS ENUM('planned', 'departed', 'arrived', 'closed');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('received', 'in_flight', 'arrived', 'delivered', 'closed');--> statement-breakpoint
CREATE TYPE "public"."order_item_category" AS ENUM('clothes', 'electronics');--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"company_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"surname" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'company_owner' NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"country_code" varchar(2) NOT NULL,
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
CREATE TABLE "companies" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "companies_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"type" "company_type" NOT NULL,
	"country" varchar(2) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "clients_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(20) NOT NULL,
	"country" varchar(2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "services_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"company_id" integer NOT NULL,
	"type" "service_type" NOT NULL,
	"pricing_type" "pricing_type" NOT NULL,
	"name" varchar(150) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dispatches" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "dispatches_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"company_id" integer NOT NULL,
	"flight_id" integer,
	"from_country" varchar(2) NOT NULL,
	"to_country" varchar(2) NOT NULL,
	"status" "dispatch_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flights" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "flights_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"from_country" varchar(2) NOT NULL,
	"from_city" varchar(3) NOT NULL,
	"to_country" varchar(2) NOT NULL,
	"to_city" varchar(3) NOT NULL,
	"rate_per_kg" numeric(8, 2) NOT NULL,
	"status" "flight_status" DEFAULT 'planned' NOT NULL,
	"departure_at" timestamp,
	"arrival_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "orders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"dispatch_id" integer NOT NULL,
	"sender_id" integer NOT NULL,
	"receiver_id" integer NOT NULL,
	"service_id" integer NOT NULL,
	"weight_kg" numeric(8, 2) NOT NULL,
	"rate_per_kg" numeric(8, 2) NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"prepaid_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"status" "order_status" DEFAULT 'received' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "order_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"order_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" "order_item_category" NOT NULL,
	"quantity" integer NOT NULL,
	"declared_value" numeric(10, 2)
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dispatches" ADD CONSTRAINT "dispatches_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dispatches" ADD CONSTRAINT "dispatches_flight_id_flights_id_fk" FOREIGN KEY ("flight_id") REFERENCES "public"."flights"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_dispatch_id_dispatches_id_fk" FOREIGN KEY ("dispatch_id") REFERENCES "public"."dispatches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_sender_id_clients_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_receiver_id_clients_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;