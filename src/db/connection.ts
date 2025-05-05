import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const databases = [
    "2019_canadian_election_online",
    "2019_canadian_election_phone",
    "2019_democracy_checkup",
    "2020_british_columbia_election",
    "2020_new_brunswick_election",
    "2020_saskatchewan_election",
    "2020_democracy_checkup",
    "2021_canadian_election",
    "2021_nova_scotia_election",
    "2021_newfoundland_election",
    "2021_democracy_checkup",
    "2022_democracy_checkup",
    "2022_ontario_election",
    "2022_quebec_election",
    "2023_democracy_checkup",
    "2023_manitoba_election", 
    "2023_alberta_election",
];

const pools: Map<string, Pool> = new Map();

databases.forEach((db) => {
  pools.set(
    db,
    mysql.createPool({
      host: process.env.RDS_HOST,
      user: process.env.RDS_USER,
      password: process.env.RDS_PASSWORD,
      database: db,
      port: parseInt(process.env.RDS_PORT!, 10),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  );
});

export const getDb = (db: string): Pool | null => {
  return pools.get(db) || null;
};

export { pools };
