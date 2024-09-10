import { drizzle } from "drizzle-orm/mysql2"; 
import mysql from "mysql2/promise";

const client = mysql.createPool(process.env.DATABASE_URL as string);
export const db = drizzle(client, { logger: true });
