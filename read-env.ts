// Note: We can give a robust implementation using a validation lib such as zod and then export the parsed object

//  change the path in dotenv config to .env.local since that is the default in nextjs 
import * as dotenv from "dotenv";
dotenv.config({
  path: ".env.local",
});

import "dotenv/config";
export interface AppEnv {
  DATABASE_URL: string;
}
export const AppEnv = process.env as unknown as AppEnv;
