import type { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const ip = req.headers["x-forwarded-for"]
      ? (req.headers["x-forwarded-for"] as string).split(",")[0].trim()
      : req.socket.remoteAddress

    try {
      // IP'yi ve ziyaret zamanını veritabanına ekle veya güncelle
      const query = `
        INSERT INTO visitors (ip_address, visit_time) 
        VALUES ($1, CURRENT_TIMESTAMP) 
        ON CONFLICT (ip_address) 
        DO UPDATE SET visit_time = CURRENT_TIMESTAMP
      `
      await db.query(query, [ip])

      res.status(200).json({ message: "Ziyaretçi kaydedildi" })
    } catch (error) {
      console.error("Hata:", error)
      res.status(500).json({ error: "Bir hata oluştu." })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

