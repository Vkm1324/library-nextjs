import { db } from "@/db/db";
import { IPageRequest, IPagedResponse } from "../../../core/pagination.model";
import { IRepository } from "../../../core/repository";
import { IBookRequestBase, IBookResquest } from "./models/books-request.model";
import { bookRequestTable } from "@/drizzle/schema/schema";
import { eq, sql, count, and, or,like } from "drizzle-orm/sql";
import { BookRepository } from "../book-management/books.repository";
import { UserRepository } from "../user-management/user.repository";

export class BookRequestRepository
  implements IRepository<IBookRequestBase, IBookResquest>
{
  async create(data: IBookRequestBase): Promise<IBookResquest> {
    const bookRequest: IBookResquest = {
      ...data,
      requestDate: new Date(),
      id: 0,
      status: "pending",
      bookTitle: ""
    };
    const [result] = await db
      .insert(bookRequestTable)
      .values(bookRequest)
      .$returningId();
    console.log(
      `BookRequest with BookRequestId:${result.id} has been added successfully `
    );
    return (await this.getById(result.id)) as IBookResquest;
  }

  async getById(id: number): Promise<IBookResquest | null> {
    const result = await db
      .select()
      .from(bookRequestTable)
      .where(eq(bookRequestTable.id, id));
    if (result) {
      return result[0] as unknown as IBookResquest;
    }
    return null;
  }
  async getByUserId(uId: number): Promise<IBookResquest | null> {
    const result = await db
      .select()
      .from(bookRequestTable)
      .where(eq(bookRequestTable.userId, uId));
    if (result) {
      return result[0] as unknown as IBookResquest;
    }
    return null;
  }
  async update(
    id: number,
    data: Partial<IBookResquest>
  ): Promise<IBookResquest | null> {
    // Ensure that if `status` is provided, it's one of the allowed values
    if (data && !["pending", "approved", "rejected"].includes(data.status!)) {
      throw new Error("Invalid status value");
    }

    const [result] = await db
      .update(bookRequestTable)
      .set({ status: data.status })
      .where(eq(bookRequestTable.id, id));
    return this.getById(result.insertId);
  }
  async fetchAllFilteredUserBookRequest(query: string, currentPage: number) {
    const ITEMS_PER_PAGE = 8;
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    // Simulate delay, remove later
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Step 1: Create the filtering condition based on the provided query
      const whereClause = query
        ? or(
            like(bookRequestTable.status, `%${query}%`), // Filter by status
            like(bookRequestTable.bookId, `%${query}%`), // Filter by bookId
            like(bookRequestTable.userId, `%${query}%`) // Filter by userId
          )
        : undefined;

      // Step 2: Execute the database query with pagination
      const paginatedResults = await db
        .select()
        .from(bookRequestTable)
        .where(whereClause)
        .limit(ITEMS_PER_PAGE)
        .offset(offset)
        .orderBy(bookRequestTable.status, bookRequestTable.id);

      // Step 3: Collect all bookIds and userIds from the fetched requests
      const bookIds = paginatedResults.map((request) => request.bookId);
      const userIds = paginatedResults.map((request) => request.userId);

      const bookRepository = new BookRepository();
      const userRepository = new UserRepository();

      // Step 4: Fetch all book titles concurrently using Promise.all()
      const books = await Promise.all(
        bookIds.map((bookId) => bookRepository.getName(bookId))
      );

      // Step 5: Fetch all usernames concurrently using Promise.all()
      const users = await Promise.all(
        userIds.map((userId) => userRepository.getUsername(userId))
      );
      // console.log(users)
      // Step 6: Create a map of bookId to bookTitle and userId to username
      const bookMap = books.reduce((acc: { [x: number]: string }, book) => {
        if (book) {
          acc[book.id] = book.title;
        }
        return acc;
      }, {} as Record<number, string>);

      const userMap = users.reduce((acc: { [x: number]: string }, user) => {
        if (user) {
          acc[user.id] = user.name;
        }
        return acc;
      }, {} as Record<number, string>);

      // Step 7: Attach bookTitle and username to each request
      const bookRequestsWithTitlesAndUsernames = paginatedResults.map(
        (request) => ({
          ...request,
          bookTitle: bookMap[request.bookId] || "Unknown",
          username: userMap[request.userId] || "Unknown",
        })
      );
      // console.log(bookRequestsWithTitlesAndUsernames);
      return bookRequestsWithTitlesAndUsernames as IBookResquest[];

    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch book requests.");
    }
  }

  async fetchAllFilteredUserRequestsPageCount(query: string): Promise<number> {
    const ITEMS_PER_PAGE = 8;
    try {
      const [countResult] = await db
        .select({ count: count() })
        .from(bookRequestTable)
        .where(
          sql`${bookRequestTable.status} LIKE ${"%" + query + "%"} OR 
          ${bookRequestTable.bookId} LIKE ${"%" + query + "%"} OR
          ${bookRequestTable.userId} LIKE ${"%" + query + "%"}
          `
        );
      const bookCount =
        countResult.count > 0 ? countResult.count / ITEMS_PER_PAGE : 0;
      // Return the  count of books
      return Math.ceil(bookCount);
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch books count.");
    }
  }

  delete(id: number): Promise<IBookResquest | null> {
    throw new Error("Method not implemented.");
  }
  list(params: IPageRequest): IPagedResponse<IBookResquest> {
    throw new Error("Method not implemented.");
  }
}

 export async function fetchFilteredBookRequestOfUser(
  uid: number,
  currentPage: number,
  query?: string
) {
  const ITEMS_PER_PAGE = 8;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Simulate delay, remove it later
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    // Step 1: Create the filtering condition based on the provided query
    const whereClause = query
      ? and(
          eq(bookRequestTable.userId, uid),
          or(
            like(bookRequestTable.bookId, `%${query}%`), // Filter by bookId
            like(bookRequestTable.status, `%${query}%`) // Filter by status
          )
        )
      : eq(bookRequestTable.userId, uid);

    // Step 2: Execute the database query with pagination
    const paginatedResults = await db
      .select()
      .from(bookRequestTable)
      .where(whereClause)
      .limit(ITEMS_PER_PAGE)
      .offset(offset)
      .orderBy(
        bookRequestTable.status, // Sort by status first
        bookRequestTable.id // Sort by ID next
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
    const bookRequestsWithTitles = paginatedResults.map((request) => ({
      ...request,
      bookTitle: bookMap[request.bookId] || "Unknown",
    }));

    return bookRequestsWithTitles as IBookResquest[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch book requests.");
  }
}


  export async function fetchFilteredUserBookRequestPageCount(
    uid: number,
    query?: string
  ): Promise<number> {
    const ITEMS_PER_PAGE = 8;
    try {
      // Step 1: Create the filtering condition based on the provided query
      const whereClause = query
        ? and(
            eq(bookRequestTable.userId, uid),
            or(
              like(bookRequestTable.bookId, `%${query}%`), // Filter by bookId
              like(bookRequestTable.status, `%${query}%`) // Filter by userId
            )
          )
        : eq(bookRequestTable.userId, uid);

      // Step 2: Fetch the count of filtered records
      const [countResult] = await db
        .select({ count: count() })
        .from(bookRequestTable)
        .where(whereClause);

      // Step 3: Calculate the total page count based on the number of items per page
      const bookCount =
        countResult.count > 0 ? countResult.count / ITEMS_PER_PAGE : 0;

      // Return the total number of pages
      return Math.ceil(bookCount);
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch books count.");
    }
  }
