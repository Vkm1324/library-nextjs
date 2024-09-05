 
import { IBook, IBookBase } from "../book-management/models/books.model";
import { IUser } from "../user-management/models/user.model";
import { ITransaction, ITransactionBase } from "./model/transaction.model";
import { BookRepository } from "../book-management/books.repository";
import { UserRepository } from "../user-management/user.repository";
import { count, eq, like, or, sql } from "drizzle-orm";
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
      const transaction: ITransaction = await this.getById(transactionId);
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

export async function fetchFilteredTransaction(uId: number, currentPage: number) {
  const ITEMS_PER_PAGE = 8;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  // TODO remove the timeout  later
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const results = await db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.userId, uId))
      .orderBy(transactionsTable.transactionId)
      .limit(ITEMS_PER_PAGE)
      .offset(offset);
    // return transaction
    return results as unknown as ITransaction[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchTransactionPageCount(uId: number): Promise<number> {
  const ITEMS_PER_PAGE = 8;
  try {
    const [countResult] = await db
      .select({ count: count() })
      .from(transactionsTable)
      .where(eq(transactionsTable.userId,uId));
    const transactionCount =
      countResult.count > 0 ? countResult.count / ITEMS_PER_PAGE : 0;
    // Return the  count of transctions
    return Math.ceil(transactionCount);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch transaction count.");
  }
}
