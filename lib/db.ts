import mysql from "mysql2/promise";

// Creamos un "pool" de conexiones (es más eficiente que abrir y cerrar a cada rato)
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "12345", // Tu contraseña de MySQL
  database: process.env.DB_NAME || "FenalDB",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Esta es la función que usarás en todas tus APIs
export async function query({
  query,
  values = [],
}: {
  query: string;
  values?: any[];
}) {
  try {
    const [results] = await pool.execute(query, values);
    return results;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
