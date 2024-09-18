// import { defineConfig } from "drizzle-kit";
// import { AppEnv } from "./read-env";

// export default defineConfig({
//   schema: "./src/drizzle/schema/schema.ts",
//   out: "./Migrations",
//   dialect: "mysql",
//   dbCredentials: {
//     url: AppEnv.DATABASE_URL as string,
//   },
//   // verbose: true,
//   strict: true,
//   breakpoints: true,
// });

import "@/drizzle/envConfig";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/drizzle/schema/postgressSchema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  strict: true,
  breakpoints: true,
});
