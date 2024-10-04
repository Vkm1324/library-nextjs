DO $$ BEGIN
 CREATE TYPE "public"."bookRequestStatus" AS ENUM('pending', 'approved', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('pending', 'completed', 'overdue');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."transactionType" AS ENUM('borrow', 'return');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "book_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"bookId" integer NOT NULL,
	"requestDate" timestamp NOT NULL,
	"status" "bookRequestStatus" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"author" varchar(255) NOT NULL,
	"publisher" varchar(255) NOT NULL,
	"genre" varchar(255) NOT NULL,
	"isbnNo" integer NOT NULL,
	"image" varchar(255),
	"numofPages" integer NOT NULL,
	"totalNumberOfCopies" integer NOT NULL,
	"availableNumberOfCopies" integer NOT NULL,
	CONSTRAINT "books_isbnNo_unique" UNIQUE("isbnNo")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"transactionId" serial PRIMARY KEY NOT NULL,
	"bookId" integer NOT NULL,
	"userId" integer NOT NULL,
	"transactionType" "transactionType" NOT NULL,
	"issuedDate" timestamp NOT NULL,
	"dueDate" timestamp,
	"returnDate" timestamp,
	"status" "status" NOT NULL,
	"lateFees" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" integer NOT NULL,
	"email" varchar(50) NOT NULL,
	"image" varchar(255),
	"address" varchar(255),
	"DOB" date,
	"phoneNum" bigint
);
