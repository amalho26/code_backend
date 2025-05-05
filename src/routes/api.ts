import express, { Request, Response, NextFunction, RequestHandler } from "express";
import { getDb } from "../db/connection";
import type { Pool } from "mysql2/promise";

declare module "express-serve-static-core" {
  interface Request {
    dbName: string;
    db: Pool;
  }
}

const router = express.Router();

const dbMiddleware: RequestHandler = (req, res, next) => {
  const dbName = req.headers["db"] as string | undefined;
  if (!dbName) {
    res.status(400).json({ error: "Missing 'db' header" });
    return;       
  }

  const dbConnection = getDb(dbName);
  if (!dbConnection) {
    res.status(500).json({ error: "Failed to connect to the database" });
    return;
  }

  req.dbName = dbName;
  req.db     = dbConnection;
  next();
};

router.use(dbMiddleware);

router.get("/all_data", async (req, res) => {
  try {
    const { dbName, db } = req;
    const [tableResults] = await db.query<any[]>(
      `SELECT table_name
         FROM information_schema.tables
        WHERE table_schema = ?`,
      [dbName]
    );
    const tables = tableResults
      .map(r => r.TABLE_NAME)
      .filter(t => t !== "survey_metadata");

    let query = `SELECT * FROM ${dbName}.survey_metadata`;
    for (const table of tables) {
      query += `
        LEFT JOIN ${dbName}.${table}
          ON survey_metadata.responseID = ${table}.responseID
      `;
    }

    const [results] = await db.query(query);
    res.json(results);
  } catch (err: any) {
    console.error("Error fetching data:", err.sqlMessage || err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
