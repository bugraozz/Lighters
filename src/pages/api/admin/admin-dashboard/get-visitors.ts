import type { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../lib/db"
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
      try {
        const query = "SELECT * FROM visitors ORDER BY visit_time DESC";
        const result = await pool.query(query);
  
        res.status(200).json(result.rows);
      } catch (error) {
        console.error("Hata:", error);
        res.status(500).json({ error: "Bir hata oluştu." });
      }
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }