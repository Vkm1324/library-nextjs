 import { date, datetime, int, mysqlTable, serial,mysqlEnum,  varchar, bigint, } from "drizzle-orm/mysql-core";
 
export const booksTable = mysqlTable("books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  publisher: varchar("publisher", { length: 255 }).notNull(),
  genre: varchar("genre", { length: 255 }).notNull(),
  isbnNo: int("isbNo").notNull().unique(),
  price: int("price"),
  image: varchar("image",{length:255}),
  numofPages: int("numofPages").notNull(),
  totalNumberOfCopies: int("totalNumberOfCopies").notNull(),
  availableNumberOfCopies: int("availableNumberOfCopies").notNull(),
});

export const usersTable = mysqlTable("Users", {
  // base data
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: int("role").notNull(),
  email: varchar("email", { length: 50 }).notNull(),
  image: varchar("image", { length: 255 }),

  // requires update data
  address: varchar("address", { length: 255 }),
  DOB: date("DOB"),
  phoneNum: bigint("phoneNum", { mode: "number", unsigned: true }),
});

export const TransactionType = mysqlEnum("transactionType", ["borrow", "return"]);
export const StatusType = mysqlEnum("status", ["pending", "completed", "overdue"]);

export const transactionsTable = mysqlTable("transactions", {
  transactionId: serial("transactionId").primaryKey(),
  bookId: int("bookId").notNull(),
  userId: int("userId").notNull(),
  transactionType: TransactionType.notNull(),
  issueddate: datetime("transactionDate").notNull(),
  dueDate: datetime("dueDate"),
  returnDate: datetime("returnDate"),
  status: StatusType.notNull(), // "pending", "completed", or "overdue"
  // HACK: Drizzle does not yet support check constraints as of writing this
  lateFees: int("lateFees"),
});

export const bookRequestStatusType = mysqlEnum("status", [
  "pending",
  "approved",
  "rejected",
]);

export const bookRequestTable = mysqlTable("BookRequest", {
  id: serial("id").primaryKey(),
  userId: int("userId").notNull(),
  bookId: int("bookId").notNull(),
  requestDate: datetime("requestDate").notNull(),
  status: bookRequestStatusType.notNull(), // "pending", "approved", or "rejected"
});

export const professorTable = mysqlTable("Professor", {
  pfid: serial("pfid").primaryKey(), // Primary Key
  userId: int("userId")
    .notNull()
    .references(() => usersTable.id), // Foreign Key to Users table
  bio: varchar("bio" ,{ length: 255 }), // Bio of the professor
  link: varchar("link", { length: 255 }), // Link (e.g., personal website or profile link)
  deptId: int("deptId") // Department ID (can also be a foreign key if needed)
});

export const departmentTable = mysqlTable("department", {
  deptId: serial("deptId").primaryKey(), // Primary Key
  deptName: varchar("deptName", { length: 255 }),
  });