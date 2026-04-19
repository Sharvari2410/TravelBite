const { closePool, runSqlFile, testConnection } = require("./connection");

async function init() {
  try {
    const now = await testConnection();
    console.log("Database connected:", now);

    await runSqlFile("schema.sql");
    console.log("Schema applied.");

    await runSqlFile("seed.sql");
    console.log("Seed data applied.");
  } catch (error) {
    console.error("Database init failed:", error.message);
    process.exitCode = 1;
  } finally {
    await closePool();
  }
}

init();
