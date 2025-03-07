import "@/drizzle/envConfig";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "@/drizzle/schema/postgressSchema";

export const db = drizzle(sql, { schema });
