import { IBook, IBookBase } from "../book-management/models/books.model";
import {
  ITransaction,
  ITransactionBase,
  ITransactionTable,
} from "./model/transaction.model";
import { BookRepository } from "../book-management/books.repository";
import { UserRepository } from "../user-management/user.repository";
import { and, count, eq, inArray, like, or, SQL, sql } from "drizzle-orm";
import { differenceInDays, addDays } from "date-fns";
import { db } from "../../db/db";
import {
  booksTable,
  transactionsTable,
  usersTable,
} from "../../drizzle/schema/postgressSchema";

export class TransactionRepository {
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
    // TODO remove due date later
    const returnPeriod = +30;
    const dueDate: Date = addDays(new Date(), returnPeriod);
    const newTransaction: Omit<ITransaction, "id" | "returnDate"> = {
      ...data,
      // TODO remove statusdate later
      status: "completed",
      issueddate: new Date(),
      dueDate: dueDate,
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
          .returning();
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
    if (result && result.length > 0) {
      return result as unknown as ITransaction;
    }
    return null;
  }
  async getByIssuedDate(issueddate: Date): Promise<ITransaction[] | null> {
    const result = await db
      .select()
      .from(transactionsTable)
      .where(sql`${transactionsTable.issueddate}=${issueddate}`);
    if (result && result.length > 0) {
      return result as unknown as ITransaction[];
    }
    return null;
  }
  // todo fix the undefined
  async updateReturnStatus(
    transactionId: number
  ): Promise<ITransaction | undefined> {
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
          lateFees: lateFeesCalculator(
            transaction.dueDate,
            transaction.returnDate
          ),
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
            ).returning();
          return result;
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

export function generateStatus(
  issueddate: Date,
  returnedDate: Date | null
): "overdue" | "completed" | "pending" {
  const fineAmountPerDay = 5;
  const currentDate = new Date();
  const normalUser = 30;
  const deu = generateDueDate(issueddate, normalUser);
  if (returnedDate) {
    return "completed";
  }
  if (differenceInDays(currentDate, deu) > 0) {
    return "overdue";
  }
  return "pending";
}

function generateDueDate(issueddate: Date, timePeriod: number): Date {
  return addDays(issueddate, timePeriod);
}

export function lateFeesCalculator(
  issueddate: Date,
  returnedDate: Date | null
): number {
  const fineAmountPerDay = 5;
  const currentDate = new Date();
  // here we can extend for features for premium users where they can have more extended due date
  const normalUser = 30;
  const deu = generateDueDate(issueddate, normalUser);
  if (returnedDate) {
    if (differenceInDays(returnedDate, deu) > 0) {
      return differenceInDays(currentDate, deu) * fineAmountPerDay;;
    }
    return 0;
  }
  console.log( currentDate,deu ,differenceInDays(currentDate, deu));
  if (differenceInDays(currentDate, deu) ) {
    return differenceInDays(currentDate, deu) * fineAmountPerDay;
  }
  return 1;
}

export async function fetchFilteredTransactionPageCount(
  uid?: number,
  query?: string
): Promise<number> {
  try {
    const whereClause = query
      ? uid !== undefined
        ? and(
            eq(transactionsTable.userId, uid),
            or(
              sql`${transactionsTable.bookId}::TEXT ILIKE ${`%${query}%`}`,
              sql`${transactionsTable.status}::TEXT ILIKE ${`%${query}%`}`
            )
          )
        : or(
            sql`${transactionsTable.bookId}::TEXT ILIKE ${`%${query}%`}`,
            sql`${transactionsTable.status}::TEXT ILIKE ${`%${query}%`}`
          )
      : uid !== undefined
      ? eq(transactionsTable.userId, uid)
      : undefined;

    const [countResult] = await db
      .select({ count: count() })
      .from(transactionsTable)
      .where(whereClause);

    return Math.ceil(countResult.count); // No need to divide by ITEMS_PER_PAGE
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch transaction count.");
  }
}


export async function fetchFilteredTransaction(
  currentPage: number,
  uid?: number,
  query?: string
) {
  const ITEMS_PER_PAGE = 8;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const whereClause = query
      ? uid !== undefined
        ? and(
            eq(transactionsTable.userId, uid),
            or(
              sql`${transactionsTable.bookId}::TEXT ILIKE ${`%${query}%`}`,
              sql`${transactionsTable.status}::TEXT ILIKE ${`%${query}%`}`
            )
          )
        : or(
            sql`${transactionsTable.bookId}::TEXT ILIKE ${`%${query}%`}`,
            sql`${transactionsTable.status}::TEXT ILIKE ${`%${query}%`}`
          )
      : uid !== undefined
      ? eq(transactionsTable.userId, uid)
      : undefined;

    const paginatedResults = await db
      .select({
        transactionId: transactionsTable.transactionId,
        bookId: transactionsTable.bookId,
        userId: transactionsTable.userId,
        transactionType: transactionsTable.transactionType,
        issueddate: transactionsTable.issueddate,
        returnDate: transactionsTable.returnDate,
        status: transactionsTable.status,
        title: booksTable.title,
        userName: usersTable.name,
      })
      .from(transactionsTable)
      .leftJoin(booksTable, eq(transactionsTable.bookId, booksTable.id))
      .leftJoin(usersTable, eq(transactionsTable.userId, usersTable.id))
      .where(whereClause)
      .limit(ITEMS_PER_PAGE)
      .offset(offset)
      .orderBy(transactionsTable.transactionId); // Removed status ordering

    return paginatedResults.map((transaction) => ({
      ...transaction,
      dueDate: generateDueDate(transaction.issueddate, 30),
      lateFees: lateFeesCalculator(
        transaction.issueddate,
        transaction.returnDate
      ),
      status: generateStatus(transaction.issueddate, transaction.returnDate),
    })) as unknown as ITransactionTable[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch book transactions.");
  }
}


export async function fetchPendingTransaction(): Promise<ITransaction[]> {
  try {
    const results = await db
      .select({ bookId: transactionsTable.bookId })
      .from(transactionsTable)
      .where(eq(transactionsTable.transactionType, "borrow"));

    // Return transactions
    return results as unknown as ITransaction[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch transactions.");
  }
}

// TODO-fix the fine will be calculated for 24 hrs like user will have 24*30 hrs to return without getting fine but the user will be having only  , make fine as not for 24 hrs dependent so tht both reflect same.
import { isNull, lt } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core"; 

// Helper function to add 30 days to issuedDate
function getDueDate(issuedDate: PgColumn) {
  const interval = 30;
  return sql`(${issuedDate} + INTERVAL '30 days')`;
}

export async function metaDataOfTransactions(id:number | undefined) {
  // Create a condition for the WHERE clause based on the provided id
  const userCondition = id ? eq(transactionsTable.userId, id) : undefined;

  // Run queries in parallel using Promise.all()
  const [
    [totalTransactions],
    [completedTransactions],
    [overdueTransactions],
    [todaysdueTransactions],
  ] = await Promise.all([
    // Query for total transactions
    db
      .select({ count: count() })
      .from(transactionsTable)
      .where(userCondition),

    // Query for completed transactions
    db
      .select({ count: count() })
      .from(transactionsTable)
      .where(
        and(eq(transactionsTable.transactionType, "return"), userCondition)
      ),

    // Query for overdue transactions
    db
      .select({ count: count() })
      .from(transactionsTable)
      .where(
        and(
          isNull(transactionsTable.returnDate),
          lt(getDueDate(transactionsTable.issueddate), sql`CURRENT_TIMESTAMP`),
          userCondition
        )
      ),

    // Query for today's due transactions
    db
      .select({ count: count() })
      .from(transactionsTable)
      .where(
        and(
          isNull(transactionsTable.returnDate),
          eq(
            sql`DATE(${getDueDate(transactionsTable.issueddate)})`,
            sql`CURRENT_DATE`
          ),
          userCondition
        )
      ),
  ]);

  // Combine the results into a single object
  const result = {
    completedTransactions: completedTransactions.count,
    overdueTransactions: overdueTransactions.count,
    todaysDueTransactions: todaysdueTransactions.count,
    totalTransactions: totalTransactions.count,
  };

  // Return the result
  return result;
}


