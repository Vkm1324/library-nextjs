import { db } from "@/db/db";
import { IPageRequest, IPagedResponse } from "../../../core/pagination.model";
import { IRepository } from "../../../core/repository";
import {
  IBookRequestBase,
  IBookResquest,
  IBookResquestTable,
} from "./models/books-request.model";
import {
  bookRequestTable,
  booksTable,
  usersTable,
} from "@/drizzle/schema/postgressSchema";
import { eq, count, and, or, like, sql } from "drizzle-orm/sql";

export class BookRequestRepository
  implements IRepository<IBookRequestBase, IBookResquest>
{
  async create(data: IBookRequestBase): Promise<IBookResquest> {
    const bookRequest: Omit<IBookResquest , 'id'> = {
      ...data,
      requestDate: new Date(),
      status: "pending",
    };
    const [result] = await db
      .insert(bookRequestTable)
      .values(bookRequest).returning();
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
      .where(eq(bookRequestTable.id, id))
      .returning()
    return result;
  }
  delete(id: number): Promise<IBookResquest | null> {
    throw new Error("Method not implemented.");
  }
  list(params: IPageRequest): IPagedResponse<IBookResquest> {
    throw new Error("Method not implemented.");
  }
}

export async function fetchFilteredBookRequestPageCount(
  uid?: number,
  query?: string
): Promise<number> {
  const ITEMS_PER_PAGE = 8;
  try {
    // Step 1: Create the filtering condition based on the provided query and uid
    let whereClause;
    if (uid !== undefined) {
      whereClause = query
        ? and(
            eq(bookRequestTable.userId, uid),
            or(
              sql`${bookRequestTable.status}::TEXT ILIKE ${`%${query}%`}`,
              sql`${bookRequestTable.bookId}::TEXT ILIKE ${`%${query}%`}`
            )
          )
        : eq(bookRequestTable.userId, uid);
    } else {
      whereClause = query
        ? or(
            sql`${bookRequestTable.status}::TEXT ILIKE ${`%${query}%`}`,
            sql`${bookRequestTable.bookId}::TEXT ILIKE ${`%${query}%`}`
          )
        : undefined;
    }
    

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
    throw new Error("Failed to fetch filtered books count.");
  }
}

export async function fetchFilteredBookRequest(
  currentPage: number,
  uid?: number,
  query?: string
) {
  const ITEMS_PER_PAGE = 8;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // Step 1: Prepare the where clause
    const whereClause = query
      ? uid !== undefined
        ? and(
            eq(bookRequestTable.userId, uid),
            or(
              sql`${bookRequestTable.status}::TEXT ILIKE ${`%${query}%`}`,
              sql`${bookRequestTable.bookId}::TEXT ILIKE ${`%${query}%`}`
            )
          )
        : or(
            sql`${bookRequestTable.status}::TEXT ILIKE ${`%${query}%`}`,
            sql`${bookRequestTable.bookId}::TEXT ILIKE ${`%${query}%`}`
          )
      : uid !== undefined
      ? eq(bookRequestTable.userId, uid)
      : undefined;

    // Step 2: Execute the database query with pagination
    const paginatedResults = await db
      .select({
        id: bookRequestTable.id,
        bookId: bookRequestTable.bookId,
        userId: bookRequestTable.userId,
        status: bookRequestTable.status,
        requestDate: bookRequestTable.requestDate,
        title: booksTable.title,
        userName: usersTable.name,
      })
      .from(bookRequestTable)
      .leftJoin(booksTable, eq(bookRequestTable.bookId, booksTable.id))
      .leftJoin(usersTable, eq(bookRequestTable.userId, usersTable.id))
      .where(whereClause)
      .limit(ITEMS_PER_PAGE)
      .offset(offset)
      .orderBy(bookRequestTable.id); // Removed status ordering to avoid enum ordering issues

    return paginatedResults as unknown as IBookResquestTable[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch filtered book transactions.");
  }
}


