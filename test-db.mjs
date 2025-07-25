import { createClient } from "@libsql/client";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

console.log("--- Starting Database Connection Test ---");
console.log("URL:", url);
console.log("Auth Token:", authToken ? "Token Found" : "Token Not Found!");

if (!url || !authToken) {
  console.error("Error: Missing database URL or auth token in .env file.");
  process.exit(1);
}

const db = createClient({
  url,
  authToken,
});

async function runTest() {
  try {
    const result = await db.execute("SELECT 'Connection successful!' as message;");
    console.log("\n✅ SUCCESS: Database connection is working.");
    console.log("Query Result:", result.rows[0]);
  } catch (error) {
    console.error("\n❌ FAILED: Database connection failed.");
    console.error("Error Details:", error);
  }
}

runTest();