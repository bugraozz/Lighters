import type { NextApiRequest, NextApiResponse } from "next";
import db from '../../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const ip = req.headers["x-forwarded-for"]
      ? (req.headers["x-forwarded-for"] as string).split(",")[0].trim()
      : req.socket.remoteAddress;

    try {
      // IP'yi veritabanına ekle, varsa hata alma
      const query = `
        INSERT INTO visitors (ip_address) 
        VALUES ($1) 
        ON CONFLICT (ip_address) DO NOTHING
      `;
      await db.query(query, [ip]);

      // Toplam ziyaretçi sayısını al
      const countResult = await db.query("SELECT COUNT(*) AS count FROM visitors");
      const totalVisitors = Number((countResult.rows[0] as unknown as { count: string }).count) || 0;

      res.status(200).json({ message: "Ziyaretçi kaydedildi", totalVisitors });
    } catch (error) {
      console.error("Hata:", error);
      res.status(500).json({ error: "Bir hata oluştu." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
