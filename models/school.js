const { pool } = require("../config/database");

class School {
  // Create schools table
  static async createTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(500) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
      )
    `;

    try {
      await pool.execute(createTableQuery);
      console.log("Schools table created successfully");
      return true;
    } catch (error) {
      console.error("Error creating schools table:", error.message);
      throw error;
    }
  }

  // Insert a new school
  static async create(schoolData) {
    const { name, address, latitude, longitude } = schoolData;
    const insertQuery = `
      INSERT INTO schools (name, address, latitude, longitude) 
      VALUES (?, ?, ?, ?)
    `;

    try {
      const [result] = await pool.execute(insertQuery, [
        name,
        address,
        latitude,
        longitude,
      ]);
      console.log(`School created with ID: ${result.insertId}`);
      return result.insertId;
    } catch (error) {
      console.error("Error creating school:", error.message);
      throw error;
    }
  }

  // Get all schools
  static async findAll() {
    const selectQuery = "SELECT * FROM schools ORDER BY created_at DESC";
    try {
      const [rows] = await pool.execute(selectQuery);
      return rows;
    } catch (error) {
      console.error("Error fetching schools:", error.message);
      throw error;
    }
  }
}

module.exports = School;
