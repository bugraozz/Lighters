import type { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("admin-track API çağrıldı")

  if (req.method === "POST") {
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown"
    ip = Array.isArray(ip) ? ip[0] : typeof ip === "string" ? ip.split(",")[0].trim() : "unknown"

    console.log("İşlenmiş ziyaretçi IP:", ip)
    console.log("Veritabanı bağlantı URL'si:", process.env.DATABASE_URL) // Dikkat: Hassas bilgi

    try {
      const checkQuery = "SELECT * FROM visitors WHERE ip_address = $1"
      const checkResult = await db.query(checkQuery, [ip])
      console.log("Veritabanı kontrol sonucu:", checkResult.rows)

      let query
      let isNewVisitor = false
      if (checkResult.rows.length === 0) {
        query = "INSERT INTO visitors (ip_address, visit_time) VALUES ($1, CURRENT_TIMESTAMP)"
        isNewVisitor = true
      } else {
        query = "UPDATE visitors SET visit_time = CURRENT_TIMESTAMP WHERE ip_address = $1"
      }

      const result = await db.query(query, [ip])
      console.log("Veritabanı işlem sonucu:", result)

      res.status(200).json({
        message: isNewVisitor ? "Yeni ziyaretçi kaydedildi" : "Ziyaretçi güncellendi",
        ip,
        isNewVisitor,
      })
    } catch (error) {
      console.error("Veritabanı hatası:", error)
      res
        .status(500)
        .json({ error: "Bir hata oluştu.", details: error instanceof Error ? error.message : String(error) })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

