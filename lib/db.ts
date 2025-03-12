import { Pool } from "pg";

let pool: Pool | undefined;

if (!pool) {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
  });
}

export default pool;

// user: process.env.DB_USER,
// host: process.env.DB_HOST,
// database: process.env.DB_DATABASE,
// password: process.env.DB_PASSWORD,
// port: Number(process.env.DB_PORT) || 5432,
// ssl: {
//   rejectUnauthorized: false, // This accepts self-signed certificates if necessary
// },
