 

// import "@/drizzle/envConfig";
// import { defineConfig } from "drizzle-kit";

// export default defineConfig({
//   schema: "./src/drizzle/schema/postgressSchema.ts",
//   dialect: "postgresql",
//   dbCredentials: {
//     url: process.env.POSTGRES_URL!,
//   },
//   strict: true,
//   breakpoints: true,
// });


import "@/drizzle/envConfig";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/drizzle/schema/postgressSchema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!, // ✅ Change to DATABASE_URL
  },
  strict: true,
  breakpoints: true,
});
