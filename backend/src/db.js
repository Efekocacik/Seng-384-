const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function testConnection() {
  try {
    const result = await pool.query("SELECT 1 AS ok");
    console.log("PostgreSQL bağlantısı başarılı:", result.rows[0]);
  } catch (err) {
    console.error("PostgreSQL bağlantı hatası:", err.message);
  }
}

testConnection();

module.exports = {
  pool
};

