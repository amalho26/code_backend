import express, { Request, Response, NextFunction } from "express";
import { getDb } from "../db/connection";
import { Pool } from "mysql2/promise";

const router = express.Router();

interface CustomRequest extends Request {
  db?: string;
  socket?: Pool;
}

router.use((req: CustomRequest, res: Response, next: NextFunction) => {
  const dbName = req.headers["db"] as string;


  const dbConnection = getDb(dbName);

  req.db = dbName;
  req.socket = dbConnection;
  next();
});

router.get("/all_data", async (req: CustomRequest, res: Response) => {
  try {
    const dbName = req.db!;
    const pool = req.socket!;

    const [tableResults] = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = '${dbName}'
    `);

    const tables = (tableResults as any[])
      .map(row => row.TABLE_NAME)
      .filter((table: string) => table !== "survey_metadata");

    let query = `SELECT * FROM ${dbName}.survey_metadata`;

    tables.forEach((table) => {
      query += ` LEFT JOIN ${dbName}.${table} 
                 ON survey_metadata.responseID = ${table}.responseID`;
    });

    const [results] = await pool.query(query);
    res.json(results);
  } catch (error: any) {
    console.error("Error fetching data:", error.sqlMessage || error.message || error);
  }
});

export default router;