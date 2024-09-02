import { IPageRequest, IPagedResponse } from "../../../core/pagination.model";
import { IRepository } from "../../../core/repository";
import { IBookBase, IBook } from "../book-management/models/books.model";
import { AppEnv } from "../../../read-env";
import mysql from "mysql2/promise";
import { db } from "../../db/db";
import { booksTable } from "../../drizzle/schema/schema";
import { eq, sql, count } from "drizzle-orm/sql";

export class BookRepository implements IRepository<IBookBase, IBook> {
  // private mySqlPoolConnection: MySqlPoolConnection;
  pool: mysql.Pool | null;

  constructor() {
    this.pool = mysql.createPool(AppEnv.DATABASE_URL);
  }

  /**
   * Creates a new book and adds it to the repository.
   * @param {IBookBase} data - The base data for the book to be created.
   * @returns {Promise<IBook>} The created book with assigned ID and available number of copies.
   */

  async create(data: IBookBase): Promise<IBook> {
    const book: IBook = {
      ...data,
      id: 0,
      availableNumberOfCopies: data.totalNumberOfCopies,
    };

    const [bookId] = await db.insert(booksTable).values(book).$returningId();
    console.log(`book with bookId:${bookId} has been added successfully `);
    return (await this.getById(bookId.id)) as IBook;
  }

  async getBooks(): Promise<IBook[]> {
    const result = await db.select().from(booksTable);
    return result as unknown as IBook[];
  }

  /**
   * Updates an existing book in the repository.
   * @param {number} id - The ID of the book to update.
   * @param {IBook} data - The new data for the book.
   * @returns {Promise<IBook | null>} The updated book or null if the book was not found.
   **/
  async update(id: number, data: IBookBase): Promise<IBook | null> {
    const result = await db
      .update(booksTable)
      .set(data)
      .where(eq(booksTable.id, id));
    // return result
    return null;
  }

  //   /**
  //    * Deletes a book from the repository.
  //    * @param {number} id - The ID of the book to delete.
  //    * @returns {Promise<IBook | null>} The deleted book or null if the book was not found.
  //    */

  async delete(id: number): Promise<IBook | null> {
    const book = await this.getById(id);
    if (book) {
      console.log("book found");
      await db.delete(booksTable).where(sql`${booksTable.id}=${id}`);
      return book;
    }
    return null;
  }

  //   /**
  //    * Retrieves a book by its ID.
  //    * @param {number} id - The ID of the book to retrieve.
  //    * @returns {IBook | null} The book with the specified ID or null if not found.
  //    */
  async getById(id: number): Promise<IBook | null> {
    const result = await db
      .select()
      .from(booksTable)
      .where(sql`${booksTable.id}=${id}`);
    if (result) {
      return result[0] as unknown as IBook;
    }
    return null;
  }

  async getByIsbn(isbn: number): Promise<IBook | null> {
    const result = await db
      .select()
      .from(booksTable)
      .where(sql`${booksTable.isbnNo}=${+isbn}`);
    return result[0] as unknown as IBook;
  }

  async getByTitle(title: string): Promise<IBook[]> {
    const result = await db
      .select()
      .from(booksTable)
      .where(sql`${booksTable.title} LIKE ${"%" + title + "%"}`);
    return result as unknown as IBook[];
  }

  list(params: IPageRequest): IPagedResponse<IBook> {
    throw new Error("Method not implemented.");
  }
}

export async function fetchFilteredBooks(query: string, currentPage: number) {
  const ITEMS_PER_PAGE = 8;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  // TODO remove the timeout  later
 await new Promise((resolve) => setTimeout(resolve, 3000));
  try {
    const results = await db
      .select()
      .from(booksTable)
      .where(sql`${booksTable.title} LIKE ${"%" + query + "%"}`)
      .orderBy(booksTable.id)
      .limit(ITEMS_PER_PAGE)
      .offset(offset);
// return books
    return results as unknown as IBook[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}
export async function fetchBooksCount(query: string): Promise<number> {
  const ITEMS_PER_PAGE = 8;
  try {
    const [countResult] = await db
      .select({ count: count() })
      .from(booksTable)
      .where(sql`${booksTable.title} LIKE ${"%" + query + "%"}`);  
    const bookCount = countResult.count > 0 ? countResult.count / ITEMS_PER_PAGE : 0;
      // Return the  count of books 
    return Math.ceil(bookCount);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch books count.");
  }
}
