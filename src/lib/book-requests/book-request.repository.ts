import { db } from "@/db/db";
import { IPageRequest, IPagedResponse } from "../../../core/pagination.model";
import { IRepository } from "../../../core/repository";
import { IBookRequestBase, IBookResquest } from "./models/books-request.model";
import { bookRequestTable } from "@/drizzle/schema/schema";
import { eq, sql, count } from "drizzle-orm/sql";

export class BookRequestRepository
  implements IRepository<IBookRequestBase, IBookResquest>
{
  async create(data: IBookRequestBase): Promise<IBookResquest> {
    const bookRequest: IBookResquest = {
      ...data,
      requestDate: new Date(),
      id: 0,
      status: "pending",
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

  async fetchFilteredBookRequest(query:string, currentPage: number) {
    const ITEMS_PER_PAGE = 8;
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    // TODO remove the timeout  later
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const results = await db
        .select()
        .from(bookRequestTable)
        .where(
          sql`${bookRequestTable.id} LIKE ${"%" + query + "%"} OR 
          ${bookRequestTable.bookId} LIKE ${"%" + query + "%"} OR
          ${bookRequestTable.userId} LIKE ${"%" + query + "%"}
          `
        )
        .orderBy(bookRequestTable.status)
        .limit(ITEMS_PER_PAGE)
        .offset(offset);
      // return transaction
      return results as unknown as IBookResquest[];
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch invoices.");
    }
  }
  async fetchAllUserRequestsPageCount(query: string): Promise<number> {
    const ITEMS_PER_PAGE = 8;
    try {
      const [countResult] = await db
        .select({ count: count() })
        .from(bookRequestTable)
        .where(sql`${bookRequestTable.userId} LIKE ${"%" + query + "%"}`);
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
