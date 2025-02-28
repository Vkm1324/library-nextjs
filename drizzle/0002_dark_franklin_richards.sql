CREATE TABLE IF NOT EXISTS "department" (
	"deptId" serial PRIMARY KEY NOT NULL,
	"deptName" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "professor" (
	"pfid" serial PRIMARY KEY NOT NULL,
	"userId" bigint NOT NULL,
	"bio" varchar(255),
	"link" varchar(255),
	"deptId" integer
);
--> statement-breakpoint
ALTER TABLE "book_requests" ALTER COLUMN "userId" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "book_requests" ALTER COLUMN "bookId" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "isbnNo" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "bookId" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "userId" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "DOB" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "price" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "credits" bigint;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "professor" ADD CONSTRAINT "professor_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
