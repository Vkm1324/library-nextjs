import { db } from "../../db/db";
import { IPageRequest, IPagedResponse } from "../../../core/pagination.model";
import { IRepository } from "../../../core/repository";
import { IDepartment, IDepartmentBase } from "./models/model";
import { departmentTable } from "@/drizzle/schema/postgressSchema";
import { sql } from "drizzle-orm/sql";

export class DepartMentRepository
  implements IRepository<IDepartmentBase, IDepartment>
{
  create(data: IDepartmentBase): Promise<IDepartment> {
    throw new Error("Method not implemented.");
  }
  update(id: number, data: IDepartmentBase): Promise<IDepartment | null> {
    throw new Error("Method not implemented.");
  }
  delete(id: number): Promise<IDepartment | null> {
    throw new Error("Method not implemented.");
  }
  list(params: IPageRequest): IPagedResponse<IDepartment> {
    throw new Error("Method not implemented.");
  }
  async getById(id: number): Promise<IDepartment | null> {
    const [result] = await db
      .select({ deptName: departmentTable.deptName })
      .from(departmentTable)
      .where(sql`${departmentTable.deptId}=${id}`);
    if (result) {
      return result as unknown as IDepartment;
    }
    return null;
  }
}
