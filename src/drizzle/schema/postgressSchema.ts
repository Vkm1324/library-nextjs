import {
  date,
  integer,
  pgTable,
  serial,
  pgEnum,
  varchar,
  bigint,
  timestamp,
} from "drizzle-orm/pg-core";

// Enums for PostgreSQL
export const transactionTypeEnum = pgEnum("transactionType", [
  "borrow",
  "return",
]);
export const statusTypeEnum = pgEnum("status", [
  "pending",
  "completed",
  "overdue",
]);
export const bookRequestStatusEnum = pgEnum("bookRequestStatus", [
  "pending",
  "approved",
  "rejected",
]);

// Books Table
export const booksTable = pgTable("books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  publisher: varchar("publisher", { length: 255 }).notNull(),
  genre: varchar("genre", { length: 255 }).notNull(),
  isbnNo: bigint("isbnNo",{ mode: "number" }).notNull().unique(),
  price: integer("price"),
  image: varchar("image", { length: 255 }),
  numofPages: integer("numofPages").notNull(),
  totalNumberOfCopies: integer("totalNumberOfCopies").notNull(),
  availableNumberOfCopies: integer("availableNumberOfCopies").notNull(),
});

// Users Table
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: integer("role").notNull(),
  email: varchar("email", { length: 50 }).notNull(),
  image: varchar("image", { length: 255 }),
  credits: bigint("credits", { mode: "number" }),
  address: varchar("address", { length: 255 }),
  DOB: timestamp("DOB"),
  phoneNum: bigint("phoneNum", { mode: "number" }),
});

// Transactions Table
export const transactionsTable = pgTable("transactions", {
  transactionId: serial("transactionId").primaryKey(),
  bookId: bigint("bookId", { mode: "number" }).notNull(),
  userId: bigint("userId", { mode: "number" }).notNull(),
  transactionType: transactionTypeEnum("transactionType").notNull(),
  issueddate: timestamp("issuedDate").notNull(),
  dueDate: timestamp("dueDate"),
  returnDate: timestamp("returnDate"),
  status: statusTypeEnum("status").notNull(),
  lateFees: integer("lateFees"),
});

// Book Request Table
export const bookRequestTable = pgTable("book_requests", {
  id: serial("id").primaryKey(),
  bookId: bigint("bookId", { mode: "number" }).notNull(),
  userId: bigint("userId", { mode: "number" }).notNull(),
  requestDate: timestamp("requestDate").notNull(),
  status: bookRequestStatusEnum("status").notNull(),
});

// Professor Table
export const professorTable = pgTable("professor", {
  pfid: serial("pfid").primaryKey(),
  userId: bigint("userId", { mode: "number" })
    .notNull()
    .references(() => usersTable.id),
  bio: varchar("bio", { length: 255 }),
  link: varchar("link", { length: 255 }),
  deptId: integer("deptId"),
});

// Department Table
export const departmentTable = pgTable("department", {
  deptId: serial("deptId").primaryKey(),
  deptName: varchar("deptName", { length: 255 }),
});
