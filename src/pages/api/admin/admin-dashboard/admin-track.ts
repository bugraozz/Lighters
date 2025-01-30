import type { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../lib/db"
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
      const forwarded = req.headers["x-forwarded-for"];
      const ip = typeof forwarded === 'string' ? forwarded.split(",")[0] : req.socket.remoteAddress;
  
      try {
        // Veritabanında IP'yi kontrol et ve ekle
        const query = `
          INSERT INTO visitors (ip_address)
          VALUES ($1)
          ON CONFLICT (ip_address) DO NOTHING
        `;
        await pool.query(query, [ip]);
  
        // Toplam ziyaretçi sayısını al
        const countResult = await pool.query("SELECT COUNT(*) AS count FROM visitors");
        const totalVisitors = countResult.rows[0].count;
  
        res.status(200).json({ message: "Ziyaretçi kaydedildi", totalVisitors });
      } catch (error) {
        console.error("Hata:", error);
        res.status(500).json({ error: "Bir hata oluştu" });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }