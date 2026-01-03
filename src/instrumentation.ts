/**
 * Next.js Instrumentation
 *
 * This file runs once when the Next.js server starts.
 * We use it to ensure the database is properly initialized.
 */

export async function register() {
  // Only run on the server
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { ensureDatabaseReady } = await import("./lib/db-init");

    console.log("\n┌────────────────────────────────────────┐");
    console.log("│  NHMS - National Health Management     │");
    console.log("│  Starting server...                    │");
    console.log("└────────────────────────────────────────┘\n");

    try {
      const isReady = await ensureDatabaseReady();
      if (isReady) {
        console.log("┌────────────────────────────────────────┐");
        console.log("│  ✓ Database initialized successfully  │");
        console.log("└────────────────────────────────────────┘\n");
      } else {
        console.log("┌────────────────────────────────────────┐");
        console.log("│  ⚠ Database may need manual setup     │");
        console.log("│  Run: npm run db:sync                 │");
        console.log("└────────────────────────────────────────┘\n");
      }
    } catch (error) {
      console.error("Database initialization error:", error);
      console.log("\n⚠ To manually setup database, run: npm run db:sync\n");
    }
  }
}
