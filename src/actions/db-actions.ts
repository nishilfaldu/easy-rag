"use server";
import { Pool } from "pg";
import fs from "fs";

export async function getTableNames(
  databaseUrl = process.env.SAMPLE_DATABASE_URL
) {
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.CA_CERT_PATH
      ? {
          ca: fs.readFileSync(process.env.CA_CERT_PATH).toString(),
        }
      : false, // Disable SSL if CA_CERT_PATH is not provided
  });

  const client = await pool.connect();
  try {
    const response = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);

    console.log("Tables:", response.rows);
    return response.rows.map((row) => row.table_name);
  } catch (error) {
    console.error("Error fetching table names:", error);
    return [];
  } finally {
    client.release(); // client is released back to the pool
  }
}

export async function getTablesWithColumns(databaseUrl: string) {
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.CA_CERT_PATH
      ? {
          ca: fs.readFileSync(process.env.CA_CERT_PATH).toString(),
        }
      : false, // Disable SSL if CA_CERT_PATH is not provided
  });

  const client = await pool.connect();
  try {
    const response = await client.query(`
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `);

    const tablesWithColumns = response.rows.reduce((acc, row) => {
      if (!acc[row.table_name]) {
        acc[row.table_name] = [];
      }
      acc[row.table_name].push(row.column_name);
      return acc;
    }, {});

    console.log("Tables with Columns:", tablesWithColumns);
    return tablesWithColumns;
  } catch (error) {
    console.error("Error fetching tables and columns:", error);
    return {};
  } finally {
    client.release(); // Ensure the client is released back to the pool
  }
}
