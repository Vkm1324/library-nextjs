// import { drizzle } from "drizzle-orm/mysql2"; 
// import * as schema from '@/drizzle/schema/schema'
// import mysql from "mysql2/promise";
// const client = mysql.createPool(process.env.DATABASE_URL as string);
// export const db = drizzle(client, { logger: true });


// import "@/drizzle/envConfig";
// import { drizzle } from "drizzle-orm/vercel-postgres";
// import { sql } from "@vercel/postgres";
// import * as schema from "@/drizzle/schema/postgressSchema";

// export const db = drizzle(sql, { schema });


import { drizzle } from "drizzle-orm/postgres-js"; // ✅ Correct driver for local DB
import postgres from "postgres";
import * as schema from "@/drizzle/schema/postgressSchema";

// Use DATABASE_URL instead of POSTGRES_URL for consistency
const connectionString = process.env.DATABASE_URL as string;
if (!connectionString) throw new Error("❌ DATABASE_URL is missing in .env");

const client = postgres(connectionString, { ssl: false }); // Disable SSL for local DB
export const db = drizzle(client, { schema });
