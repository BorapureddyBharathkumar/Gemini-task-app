// drizzle.config.ts
import 'dotenv/config'; // Keep this at the very top!
import { defineConfig } from 'drizzle-kit';

console.log('Value of DATABASE_URL:', process.env.DATABASE_URL); // <--- ADD THIS LINE TEMPORARILY

export default defineConfig({
  schema: "./lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});