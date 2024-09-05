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
    if (
      data &&
      !["pending", "approved", "rejected"].includes(data.status!)
    ) {
      throw new Error("Invalid status value");
    }

    const [result] = await db
      .update(bookRequestTable)
      .set(data) //  
      .where(eq(bookRequestTable.id, id));

    return this.getById(result.insertId);
  }
  delete(id: number): Promise<IBookResquest | null> {
    throw new Error("Method not implemented.");
  }
  list(params: IPageRequest): IPagedResponse<IBookResquest> {
    throw new Error("Method not implemented.");
  }
}
