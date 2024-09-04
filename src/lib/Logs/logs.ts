// logsRepository.js

import { db } from "../db/db";
import { logTable } from "../drizzle/schema/schema";
import { eq } from "drizzle-orm";
export class LogsRepository {

  async getById(uid: number) {
  const result= db.select({ refreshToken: logTable.refreshToken })
      .from(logTable)
    .where(eq(logTable.userId, uid));
  return result; 
  }
  async create({ userId, refreshToken }) {
    try {
      const result = await db.insert(logTable).values({
        userId,
        refreshToken,
      });
      return result;
    } catch (error) {
      console.error("Error inserting log record:", error);
      throw error;
    }
  }
  async remove({ refreshToken }) {
    try {
      const result = await db
        .delete(logTable)
        .where(eq(logTable.refreshToken, refreshToken));
      return result;
    } catch (error) {
      console.error("Error removing log record:", error);
      throw error;
    }
  }
  async removeAll(uid: number) {
    try {
      const [result] = await db
        .delete(logTable)
        .where(eq(logTable.userId, uid));
      // return the number of rows deleted associated with that userId
      return result.affectedRows;
    } catch (error) {
      console.error("Error removing log record:", error);
      throw error;
    }
  }
  async blacklist(userId: number ) {
    try {
      const [result] = await db.insert(logTable).values({
        userId,
        refreshToken:"blacklisted"
      });
      return result.insertId;

    } catch (error) {
      console.error("Error inserting log record:", error);
      throw error;
    }
  }
}
