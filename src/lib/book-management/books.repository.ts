import { IPageRequest, IPagedResponse } from "../../../core/pagination.model";
import { IRepository } from "../../../core/repository";
import { IBookBase, IBook, IBookTitle } from "../book-management/models/books.model";
import { AppEnv } from "../../../read-env";
import mysql from "mysql2/promise";
import { db } from "../../db/db";
import { booksTable } from "../../drizzle/schema/schema";
import { eq, sql, count, or, like } from "drizzle-orm/sql";

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

  async getName(id: number): Promise<IBookTitle | null> {
    const result = await db
      .select({ title: booksTable.title,id:booksTable.id })
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

  // Simulate delay, remove later
  await new Promise((resolve) => setTimeout(resolve, 3000));

  try {
    // Step 1: Create the filtering condition based on the provided query
    const whereClause = query
      ? or(
          like(booksTable.title, `%${query}%`), // Filter by status
          like(booksTable.id, `%${+query}%`), // Filter by bookId
          like(booksTable.publisher, `%${query}%`), // Filter by publisher
          like(booksTable.genre, `%${query}%`), // Filter by genre
          like(booksTable.author, `%${query}%`), // Filter by author
          like(booksTable.isbnNo, `%${+query}%`) // Filter by isbn
        )
      : undefined;

    // Step 2: Execute the database query with pagination
    const results = await db
      .select()
      .from(booksTable)
      .where(whereClause)
      .limit(ITEMS_PER_PAGE)
      .offset(offset)
      .orderBy(booksTable.id);

    // Step 3: Return the results casted to IBook[]
    return results as unknown as IBook[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch books.");
  }
}

export async function fetchBooksCount(query: string): Promise<number> {
  const ITEMS_PER_PAGE = 8;

  try {
    // Step 1: Create the filtering condition based on the provided query
    const whereClause = query
      ? or(
          like(booksTable.title, `%${query}%`), // Filter by status
          like(booksTable.id, `%${+query}%`), // Filter by bookId
          like(booksTable.publisher, `%${query}%`), // Filter by publisher
          like(booksTable.author, `%${query}%`), // Filter by author
          like(booksTable.genre, `%${query}%`), // Filter by genre
          like(booksTable.isbnNo, `%${+query}%`) // Filter by isbn
        )
      : undefined;

    // Step 2: Execute the database query to get the count
    const [countResult] = await db
      .select({ count: count() })
      .from(booksTable)
      .where(whereClause);

    // Step 3: Calculate total pages based on book count
    const bookCount =
      countResult.count > 0 ? countResult.count / ITEMS_PER_PAGE : 0;

    // Step 4: Return the total number of pages
    return Math.ceil(bookCount);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch books count.");
  }
}

