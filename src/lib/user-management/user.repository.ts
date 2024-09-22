import { IPageRequest, IPagedResponse } from "../../../core/pagination.model";
import { IRepository } from "../../../core/repository";
import {
  IUser,
  IUserBase,
  IUserDisplay,
  IUserProfile,
  Roles,
} from "./models/user.model"; 
import { db } from "../../db/db";
import { usersTable } from "../../drizzle/schema/schema";
import { count, eq, inArray, sql } from "drizzle-orm/sql";
/**
 * Class representing a user repository.
 * @implements {IRepository<IUserBase, IUser>}
 */
export class UserRepository implements IRepository<IUserBase, IUser> {
  async fetchFilteredUsers(query: string, currentPage: number) {
    const ITEMS_PER_PAGE = 8;
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    // TODO remove the timeout  later
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const results = await db
        .select()
        .from(usersTable)
        // TODO include role too in where conditon
        .where(
          sql`${usersTable.id} LIKE ${"%" + query + "%"} OR 
          ${usersTable.name} LIKE ${"%" + query + "%"} OR
          ${usersTable.email} LIKE ${"%" + query + "%"}
          `
        )
        .orderBy(usersTable.id)
        .limit(ITEMS_PER_PAGE)
        .offset(offset);
      // return user
      return results as unknown as IUser[];
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch invoices.");
    }
  }

  async fetchAllUsersPageCount(query: string): Promise<number> {
    const ITEMS_PER_PAGE = 8;
    try {
      const [countResult] = await db
        .select({ count: count() })
        .from(usersTable)
        .where(sql`${usersTable.id} LIKE ${"%" + query + "%"}`);
      const bookCount =
        countResult.count > 0 ? countResult.count / ITEMS_PER_PAGE : 0;
      // Return the  count of books
      return Math.ceil(bookCount);
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch books count.");
    }
  }
  /**
   * Creates a new user.
   * @param {IUserBase} data - The user data.
   * @returns {Promise<IUser>} The created user.
   */
  // destructure and  then insert 
  async create(data: IUserBase): Promise<IUser> {
    const user: IUser = {
      ...data,
      id: 0,
      role: Roles.User,
      DOB: null,
      phoneNum: null,
      address: null,
    };
    const [result] = await db.insert(usersTable).values(user).$returningId();
    console.log(`User with UserId:${result.id} has been added successfully `);
    return (await this.getById(result.id)) as IUser;
  }

  /**
   * Retrieves a user by ID.
   * @param {number} id - The ID of the user.
   * @returns {IUser | null} The user or null if not found.
   */
  async getById(id: number): Promise<IUser | null> {
    const result = await db
      .select()
      .from(usersTable)
      .where(sql`${usersTable.id}=${id}`);
    if (result) {
      return result[0] as unknown as IUser;
    }
    return null;
  }
  async getByMail(mail: string): Promise<IUser | null> {
    const [result] = await db
      .select()
      .from(usersTable)
      .where(sql`${usersTable.email}=${mail}`);
    if (result) {
      return result as unknown as IUser;
    }
    return null;
  }
  async getByName(name: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(sql`${usersTable.name} LIKE ${"%" + name + "%"}`);
    return result as unknown as IUser[];
  }


async  getUsername(ids: number[]): Promise<Array<IUser> | null> {
  const result = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
    })
    .from(usersTable)
    .where(inArray(usersTable.id, ids));
  if (result.length > 0) {
    return result as IUser[];
  }
  return null;
}

  async getByPhoneNumber(phoneNumber: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(sql`${usersTable.phoneNum}=${+phoneNumber}`);
    if (result) {
      return result[0] as unknown as IUser;
    }
    return null;
  }
  // TODO compatible to update image too
  async update(
    id: number,
    updatedData: IUserBase // Change this to IUserBase to match base type
  ): Promise<IUser | null> {
    try {
      const result = await db
        .update(usersTable)
        .set({
          name: updatedData.name,
          DOB: updatedData.DOB,
          phoneNum: updatedData.phoneNum,
          address: updatedData.address,
          email: updatedData.email,
          // role:updatedData.role
        })
        .where(eq(usersTable.id, id));
      return await this.getById(id);
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user");
    }
  }

  async delete(id: number): Promise<IUser | null> {
    const book = await this.getById(id);
    if (book) {
      await db.delete(usersTable).where(sql`${usersTable.id}=${id}`);
      return book;
    }
    return null;
  }

  list(params: IPageRequest): IPagedResponse<IUser> {
    throw new Error("Method not implemented.");
  }

  // /**
  //  * Retrieves the list of users from the database.
  //  * @private
  //  * @returns {IUser[]} The list of users.
  //  */
  // private get users(): IUser[] {
  //   return this.db.table<IUser>("users");
  // }

  // /**
  //  * Updates an existing user.
  //  * @param {number} UserIdToUpdate - The ID of the user to update.
  //  * @param {IUserBase} updatedData - The updated user data.
  //  * @returns {IUser | null} The updated user or null if not found.
  //  */
  // async update(
  //   UserIdToUpdate: number,
  //   updatedData: IUserBase
  // ): Promise<IUser | null> {
  //   // const user = await this.getById(UserIdToUpdate);
  //   // console.log(user);
  //   // if (updatedData.name != "") {
  //   //   user!.name = updatedDa ta.name;
  //   //   this.db.save();
  //   // }
  //   // if (updatedData.DOB != "") {
  //   //   user!.DOB = updatedData.DOB;
  //   //   this.db.save();
  //   // }
  //   // if (updatedData.phoneNum != NaN! || updatedData.phoneNum !== 0) {
  //   //   console.log(
  //   //     typeof updatedData.phoneNum,
  //   //     updatedData.phoneNum,
  //   //     user!.phoneNum
  //   //   );
  //   //   user!.phoneNum = updatedData.phoneNum;
  //   //   this.db.save();
  //   // }
  //   // return user;
  //   return null;
  // }

  // /**
  //  * Deletes a user by ID.
  //  * @param {number} id - The ID of the user to delete.
  //  * @returns {IUser | null} The deleted user or null if not found.
  //  */
  // async delete(id: number): Promise<IUser | null> {
  //   // const userToDelete = this.getById(id);
  //   // const index = this.users.findIndex((user) => user.UserId === id);
  //   // this.users.splice(index, 1);
  //   // this.db.save();
  //   // return userToDelete;
  //   return null;
  // }

  /**
   * Lists all users.
   */
  lists() {
    console.table();
  }
}

export async function update(
  id: number,
  updatedData: Omit<IUserProfile, "image">
): Promise<IUser | null> {
  try {
    const result = await db
      .update(usersTable)
      .set({
        name: updatedData.name,
        DOB: updatedData.DOB,
        phoneNum: updatedData.phoneNum,
        address: updatedData.address,
        email: updatedData.email,
      })
      .where(eq(usersTable.id, id));
    const user = new UserRepository();
    return await user.getById(id);
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}

export const getRoleName = (role: number) => {
  switch (role) {
    case Roles.Admin:
      return "Admin";
    case Roles.Editor:
      return "Editor";
    case Roles.User:
      return "User";
    default:
      return "Unknown Role";
  }
};
