import { db } from "../../db/db";
import { IPageRequest, IPagedResponse } from "../../../core/pagination.model";
import { IRepository } from "../../../core/repository";
import { IProfessor, IProfessorBase, } from "./models/model";
import {
  departmentTable,
  professorTable,
  usersTable,
} from "@/drizzle/schema/postgressSchema";
import { sql, eq } from "drizzle-orm/sql";

import { asc, desc, like, or, relations } from "drizzle-orm";
import { DepartMentRepository } from "../department/department.repositories";
import { UserRepository } from "../user-management/user.repository"; 

export const professorRelations = relations(professorTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [professorTable.userId],
    references: [usersTable.id],
  }),
  department: one(departmentTable, {
    fields: [professorTable.deptId],
    references: [departmentTable.deptId],
  }),
}));

export class ProfessorRepository implements IRepository<IProfessorBase, IProfessor> { 

  async create(data: Pick<IProfessorBase, "userId">): Promise<IProfessor> {
    const [result] = await db
      .insert(professorTable)
      .values({ userId: data.userId })
      .returning();
    // console.log(`User with PfidId:${result.pfid} has been added successfully `);
    return (await this.getById(result.pfid)) as IProfessor;
  }

  async getById(userId: number): Promise<IProfessor | null> {
    const [result] = await db
      .select()
      .from(professorTable)
      .where(sql`${professorTable.userId}=${userId}`);
    if (result) {
      const dept = new DepartMentRepository();
      const user = new UserRepository();
     const department = result.deptId
       ? await dept
           .getById(result.deptId)
           .then((deptResult) => deptResult?.deptName)
       : "  ";
      // console.log("department",department);
      const userName = await user.getUsername([result.userId]);
      const result1 = {
        ...result,
        name: userName ? userName[0].name : "Not found",
        department: department,
      };
      return result1 as unknown as IProfessor;
    }
    return null;
  }
  async update(
    id: number,
    data: Omit<IProfessorBase, "userId">
  ): Promise<IProfessor | null> {
    try {
      const result = await db
        .update(professorTable)
        .set({
          bio: data.bio,
          deptId: data.deptId,
          link: data.link,
          // role:updatedData.role
        })
        .where(eq(professorTable.userId, id));
      return await this.getById(id);
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user");
    }
  }
  async delete(id: number): Promise<IProfessor | null> {
    const professor = await this.getById(id);
    if (professor) {
      await db
        .delete(professorTable)
        .where(sql`${professorTable.userId}=${id}`);
      return professor;
    }
    return null;
  }
  list(params: IPageRequest): IPagedResponse<IProfessor> {
    throw new Error("Method not implemented.");
  }
}

export async function fetchFilteredprofessors(
  query: string,
  currentPage: number,
  key: keyof IProfessor | undefined
  // sortOrd: string | undefined
) {
  const ITEMS_PER_PAGE = 8;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  if (!key) {
    key = "userId";
  }
  // Simulate delay, remove later
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  try {
    // Step 1: Create the filtering condition based on the provided query
    const whereClause = query
      ? or(
          like(professorTable.bio, `%${query}%`), // Filter by status
          like(professorTable.deptId, `%${+query}%`), // Filter by bookId
          like(professorTable.userId, `%${query}%`) // Filter by publisher
        )
      : undefined;

    // Step 2: Execute the database query with pagination
    const results = await db
      .select({
        bio: professorTable.bio,
        userId: professorTable.userId,
        link: professorTable.link,
        name: usersTable.name,
        department:departmentTable.deptName
      })
      .from(professorTable)
      .leftJoin(usersTable, eq(professorTable.userId, usersTable.id))
      .leftJoin(
        departmentTable,
        eq(professorTable.deptId, departmentTable.deptId)
      )
      .where(whereClause)
      .limit(ITEMS_PER_PAGE)
      .offset(offset)
      .orderBy
      // sortOrd === "asc" ? asc(professorTable[key]) : desc(professorTable[key])
      ();

    // Step 3: Return the results casted to IBook[]
    return results as unknown as IProfessor[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch books.");
  }
}
