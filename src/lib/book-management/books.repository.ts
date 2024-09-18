import { IPageRequest, IPagedResponse } from "../../../core/pagination.model";
import { IRepository } from "../../../core/repository";
import { IBookBase, IBook, IBookTitle } from "../book-management/models/books.model";
import { db } from "../../db/db";
import { booksTable } from "../../drizzle/schema/postgressSchema";
import { eq, sql, count, or, like } from "drizzle-orm/sql";
import {  desc, inArray } from "drizzle-orm/sql";
import { asc } from "drizzle-orm";

export class BookRepository implements IRepository<IBookBase, IBook> {
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

    const [createdBook] = await db.insert(booksTable).values(book).returning();
    return createdBook as IBook;
  }
async  getBooks(): Promise<IBook[]> {
  const result = await db.select().from(booksTable);
  return result as IBook[];
}

async  update(id: number, data: IBookBase): Promise<IBook | null> {
  const [updatedBook] = await db
    .update(booksTable)
    .set(data)
    .where(eq(booksTable.id, id))
    .returning();
  return updatedBook as IBook | null;
}

async  delete(id: number): Promise<IBook | null> {
  const [deletedBook] = await db
    .delete(booksTable)
    .where(eq(booksTable.id, id))
    .returning();
  return deletedBook as IBook | null;
}


async  getById(id: number): Promise<IBook | null> {
  const [book] = await db
    .select()
    .from(booksTable)
    .where(eq(booksTable.id, id));
  return book as IBook | null;
}

async  getTitle(ids: number[]): Promise<IBookTitle[] | null> {
  const result = await db
    .select({ title: booksTable.title, id: booksTable.id })
    .from(booksTable)
    .where(inArray(booksTable.id, ids));
  if (result.length > 0) {
    return result as IBookTitle[];
  }
  return null;
}

async  getByIsbn(isbn: number): Promise<IBook | null> {
  const [book] = await db
    .select()
    .from(booksTable)
    .where(eq(booksTable.isbnNo, isbn));
  return book as IBook | null;
}

async  getByTitle(title: string): Promise<IBook[]> {
  const result = await db
    .select()
    .from(booksTable)
    .where(sql`${booksTable.title} ILIKE ${`%${title}%`}`);
  return result as IBook[];
}

  list(params: IPageRequest): IPagedResponse<IBook> {
    throw new Error("Method not implemented.");
  }
}

export async function fetchFilteredBooks(
  query: string,
  currentPage: number,
  key: keyof IBook | undefined,
  sortOrd: string | undefined
) {
  const ITEMS_PER_PAGE = 8;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  if (!key) {
    key = "id";
  }
  // Simulate delay, remove later
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  try {
const whereClause = query
  ? or(
      sql`${booksTable.title} ILIKE ${`%${query}%`}`,
      sql`${booksTable.id}::text ILIKE ${`%${query}%`}`,
      sql`${booksTable.publisher} ILIKE ${`%${query}%`}`,
      sql`${booksTable.genre} ILIKE ${`%${query}%`}`,
      sql`${booksTable.author} ILIKE ${`%${query}%`}`,
      sql`${booksTable.isbnNo}::text ILIKE ${`%${query}%`}`
    )
  : undefined;

    const results = await db
      .select()
      .from(booksTable)
      .where(whereClause)
      .limit(ITEMS_PER_PAGE)
      .offset(offset)
      .orderBy(
        sortOrd === "asc" ? asc(booksTable[key]) : desc(booksTable[key])
      );

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

   
 
 