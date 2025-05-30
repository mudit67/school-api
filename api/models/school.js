const { dbPool } = require("../configs/dbConfig");

class School {
  static async createTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(500) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
        UNIQUE (latitude, longitude)
      )
    `;

    try {
      await dbPool.execute(createTableQuery);
      console.log("Schools table created successfully");
      return true;
    } catch (error) {
      console.error("Error creating schools table:", error.message);
      throw error;
    }
  }

  static async deleteTable() {
    const query = `
      DROP TABLE IF EXISTS schools
    `;

    try {
      await dbPool.execute(query);
      console.log("Schools table deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting schools table:", error.message);
      throw error;
    }
  }
  static async deleteData() {
    console.log("Deleting Data.");
    const query = `
      DELETE FROM schools
    `;

    try {
      await dbPool.execute(query);
      console.log("Schools data deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting schools table:", error.message);
      throw error;
    }
  }

  static async create(schoolData) {
    const { name, address, latitude, longitude } = schoolData;
    const insertQuery = `
      INSERT INTO schools (name, address, latitude, longitude) 
      VALUES (?, ?, ?, ?)
    `;

    try {
      const [result] = await dbPool.execute(insertQuery, [
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

  static async findClosetSchool(latitude, longitude) {
    const selectQuery = "SELECT * FROM schools";
    try {
      let [rows] = await dbPool.execute(selectQuery);
      if (rows && rows.length > 1) {
        rows.sort((a, b) => {
          const dist1 = Math.sqrt(
            Math.pow(Number(a.latitude) - Number(latitude), 2) +
              Math.pow(Number(a.longitude) - Number(longitude), 2)
          );
          const dist2 = Math.sqrt(
            Math.pow(Number(b.latitude) - Number(latitude), 2) +
              Math.pow(Number(b.longitude) - Number(longitude), 2)
          );
          console.log(dist1, dist2, a, b, longitude, latitude);
          console.log("\n\n");
          return dist1 - dist2;
        });
      }
      return rows;
    } catch (error) {
      console.error("Error fetching schools:", error.message);
      throw error;
    }
  }
  static async findAll() {
    const selectQuery = "SELECT * FROM schools";
    try {
      const [rows] = await dbPool.execute(selectQuery);

      return rows;
    } catch (error) {
      console.error("Error fetching schools:", error.message);
      throw error;
    }
  }

  static async findById(id) {
    const selectQuery = "SELECT * FROM schools WHERE id = ?";

    try {
      const [rows] = await dbPool.execute(selectQuery, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("Error fetching school:", error.message);
      throw error;
    }
  }
}

module.exports = School;
