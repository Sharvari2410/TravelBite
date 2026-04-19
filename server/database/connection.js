const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.PGHOST,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : undefined
});

async function query(text, params = []) {
  return pool.query(text, params);
}

async function testConnection() {
  const result = await query("SELECT NOW() AS now");
  return result.rows[0]?.now;
}

async function closePool() {
  await pool.end();
}

async function runSqlFile(fileName) {
  const filePath = path.resolve(__dirname, fileName);
  const sql = fs.readFileSync(filePath, "utf8");
  await query(sql);
}

module.exports = {
  pool,
  query,
  testConnection,
  closePool,
  runSqlFile
};
