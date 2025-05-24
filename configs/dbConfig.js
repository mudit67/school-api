const mysql = require("mysql2/promise");
// require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: 3306,
  user: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const dbPool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
});

async function testConnection() {
  console.log(dbConfig);
  try {
    const connection = await dbPool.getConnection();
    console.log("Database connected successfully");
    connection.release();
    return true;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return false;
  }
}

module.exports = { dbPool, testConnection };
