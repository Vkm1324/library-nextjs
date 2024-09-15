 
import { IBook, IBookBase } from "../book-management/models/books.model";
import { IUser } from "../user-management/models/user.model";
import { ITransaction, ITransactionBase } from "./model/transaction.model";
import { BookRepository } from "../book-management/books.repository";
import { UserRepository } from "../user-management/user.repository";
import { and, count, eq, like, or, sql } from "drizzle-orm";
import mysql from "mysql2/promise";
 
import { db } from "../../db/db";
import { booksTable, transactionsTable, usersTable } from "../../drizzle/schema/schema";
export class TransactionRepository {
  // pool: mysql.Pool | null;
  private userRepo: UserRepository;
  private bookRepo: BookRepository;

  constructor() { 
    this.userRepo = new UserRepository();
    this.bookRepo = new BookRepository();
  }

  async create(data: ITransactionBase): Promise<ITransaction | null> {
    if ((await this.userRepo.getById(data.userId)) === undefined) {
      // TODO return appropriate message
      // console.log(errorTheme("No Users with the ID:", data.userId));
      return null;
    }
    
    const book = await this.bookRepo.getById(data.bookId);
    
    if (book === undefined || book === null) {
      // TODO return appropriate message
      // console.log(errorTheme("No book with the ID:", data.bookId));
      return null;
    } else if (book.availableNumberOfCopies <= 0) {
      // TODO return appropriate message
      // console.log(errorTheme("Currently the book is not available"));
      return null;
    }

    const updatedBook: IBook = {
      ...book,
      availableNumberOfCopies: book.availableNumberOfCopies - 1,
    };

    const returnPeriod = +30;
    const returnDate: Date = addDaysToDate(returnPeriod);

    function addDaysToDate(
      daysToAdd: number,
      baseDate: Date = new Date()
    ): Date {
      const resultDate = new Date(baseDate);
      resultDate.setDate(resultDate.getDate() + daysToAdd);
      return resultDate;
    }
    const newTransaction: Omit<ITransaction, "id" | "returnDate"> = {
      ...data,
      status: "completed",
      issueddate: new Date(),
      dueDate: returnDate,
      transactionId: 0,
      transactionType: "borrow",
      lateFees: 0,
    };

    try {
      // Execution of queries:
      const createdTrxnId = await db.transaction(async (trxn) => {
        await trxn
          .update(booksTable)
          .set(updatedBook)
          .where(eq(booksTable.id, updatedBook.id));

        const [result] = await trxn
          .insert(transactionsTable)
          .values(newTransaction)
          .$returningId();
        return result.transactionId;
      });
      const issuedTransaction = (await this.getById(createdTrxnId))!;
      // TODO return appropriate message
      // console.log(sucessTheme(` TRANSACTION SUCCESSFULL`));
      // console.log(issuedTransaction);
      return issuedTransaction;
    } catch (err) {
      // TODO return appropriate message
      // console.log(err);
      // console.log(errorTheme("TRANSACTION  fAILED "));
    } finally {
      // TODO release the db.connection
    }

    return null;
  }
  async getById(id: number): Promise<ITransaction | null> {
    const result = await db
      .select()
      .from(transactionsTable)
      .where(sql`${transactionsTable.transactionId}=${id}`);
    if (result) {
      return result[0] as unknown as ITransaction;
    }
    return null;
  }
  async getByUserId(id: number): Promise<ITransaction | null> {
    const result = await db
      .select()
      .from(transactionsTable)
      .where(sql`${transactionsTable.userId}=${id}`);
    if (result && result.length>0) {
      return result as unknown as ITransaction;
    }
    return null;
  }

  async updateReturnStatus(transactionId: number): Promise<ITransaction> {
    try {
      const transaction = await this.getById(transactionId);
      if (transaction) {
        if (transaction.transactionType === "return") {
          throw new Error("This book has already been returned.");
        }
        let book = await this.bookRepo.getById(transaction.bookId);
        if (!book) {
          throw new Error("Book not found.");
        }
        const updatedBook: IBook = {
          ...book,
          availableNumberOfCopies: book.availableNumberOfCopies + 1,
        };

        const updatedTransaction: ITransaction = {
          ...transaction,
          transactionType: "return",
          returnDate: new Date(),
          lateFees: lateFeesCalculator(transaction.dueDate),
        };

        // Execution of queries:
        const updated = await db.transaction(async (trxn) => {
          await trxn
            .update(booksTable)
            .set(updatedBook)
            .where(eq(booksTable.id, updatedBook.id));

          const [result] = await trxn
            .update(transactionsTable)
            .set(updatedTransaction)
            .where(
              eq(
                transactionsTable.transactionId,
                updatedTransaction.transactionId
              )
            );
          return result.affectedRows;
        });
        if (updated) {
          return updatedTransaction;
        } else throw new Error("Transaction could not be updated");
      } else {
        throw new Error(
          "Transaction not found. Please enter correct transaction ID."
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  }
}
function lateFeesCalculator(dueDate: Date): number {
  const fineAmountPerDay = 5;
  const currentDate = new Date();
  if (dueDate.getDate() > currentDate.getDate()) {
    return (currentDate.getDate() - dueDate.getDate()) * fineAmountPerDay;
  }
  return 0;
} 

export async function fetchFilteredTransaction(query:string ,currentPage: number) {
  const ITEMS_PER_PAGE = 8;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  // TODO remove the timeout  later
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const results = await db
      .select()
      .from(transactionsTable)
      .where(
        sql`${transactionsTable.status} LIKE ${"%" + query + "%"} OR 
          ${transactionsTable.bookId} LIKE ${"%" + query + "%"} OR
          ${transactionsTable.userId} LIKE ${"%" + query + "%"}
          `
      )
      .orderBy(
        transactionsTable.transactionType,
        transactionsTable.transactionId
      )
      .limit(ITEMS_PER_PAGE)
      .offset(offset);
    // return transaction
    return results as unknown as ITransaction[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch transactions.");
  }
}
export async function fetchTransactionPageCount(
  query: string
): Promise<number> {
  const ITEMS_PER_PAGE = 8;
  try {
    const [countResult] = await db
      .select({ count: count() })
      .from(transactionsTable)
      .where(sql`${transactionsTable.status} LIKE ${"%" + query + "%"}`);
    const transactionCount =
      countResult.count > 0 ? countResult.count / ITEMS_PER_PAGE : 0;
    // Return the  count of transctions
    return Math.ceil(transactionCount);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch transaction count.");
  }
}

export async function fetchTransactionPageCountOfUser(
  uId: number,
  query?: string
): Promise<number> {
  const ITEMS_PER_PAGE = 8;
  try {
    // Step 1: Define the filtering condition
    const whereClause = query
      ? and(
          eq(transactionsTable.userId, uId),
          or(
            like(transactionsTable.bookId, `%${+query}%`), // Filter by bookId
            like(transactionsTable.status, `%${query}%`) // Filter by userId
          )
        )
      : eq(transactionsTable.userId, uId);

    // Step 2: Fetch the count of records that match the filtering condition
    const [countResult] = await db
      .select({ count: count() })
      .from(transactionsTable)
      .where(whereClause); // Apply the filtering condition

    // Step 3: Calculate the total number of pages based on the count of transactions
    const transactionCount =
      countResult.count > 0 ? countResult.count / ITEMS_PER_PAGE : 0;

    // Return the total number of pages
    return Math.ceil(transactionCount);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch transaction count.");
  }
}

export async function fetchFilteredTransactionOfUser(
    uid: number,
    currentPage: number,
    query?: string,
  ) {
    const ITEMS_PER_PAGE = 8;
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    // TODO: remove the timeout later
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      // Step 1: Fetch and filter the records in the database using Drizzle ORM

      // If query is provided, apply filtering with LIKE
      const whereClause = query
        ? and(
            eq(transactionsTable.userId, uid),
            or(
              like(transactionsTable.bookId, `%${query}%`),
              like(transactionsTable.status, `%${query}%`)
            )
          )
        : eq(transactionsTable.userId, uid);

      // Step 2: Execute the database query with pagination
      const paginatedResults = await db
        .select()
        .from(transactionsTable)
        .where(whereClause)
        .limit(ITEMS_PER_PAGE)
        .offset(offset)
        .orderBy(
          transactionsTable.status, // Sort by status first
          transactionsTable.transactionId // Sort by ID next
      );
      // Step 3: Collect all bookIds from the fetched requests
      const bookIds = paginatedResults.map((request) => request.bookId);
      const bookRepository = new BookRepository();

      // Step 4: Fetch all book titles concurrently using Promise.all()
      const books = await Promise.all(
        bookIds.map((bookId) => bookRepository.getName(bookId)) // Use getName to fetch titles
      );

      // Step 5: Create a map of bookId to bookTitle for faster lookups
      const bookMap = books.reduce((acc: { [x: number]: string }, book) => {
        if (book) {
          acc[book.id] = book.title;
        }
        return acc;
      }, {} as Record<number, string>);
      // console.log(bookMap);
      // Step 6: Attach bookTitle to each request using the bookMap
      const bookTransactionsWithTitles = paginatedResults.map((request) => ({
        ...request,
        bookTitle: bookMap[request.bookId] || "Unknown",
      }));

      return bookTransactionsWithTitles as unknown as ITransaction[];
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch book requests.");
    }
}
  

export async function fetchPendingTransaction(): Promise<ITransaction[]> {
  // TODO remove the timeout later
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const results = await db
      .select({ bookId: transactionsTable.bookId })
      .from(transactionsTable)
      .where(eq(transactionsTable.transactionType, "borrow"))
      .orderBy(transactionsTable.bookId);

    // Return transactions
    // console.log("its results",results);  
    return results as unknown as ITransaction[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch transactions.");
  }
}