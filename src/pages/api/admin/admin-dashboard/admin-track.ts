


import type { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown"

    // IP adresini string'e çevirelim ve ilk IP'yi alalım (proxy durumunda)
    ip = Array.isArray(ip) ? ip[0] : typeof ip === "string" ? ip.split(",")[0].trim() : "unknown"

    console.log("Ham IP verisi:", req.headers["x-forwarded-for"])
    console.log("Socket remote address:", req.socket.remoteAddress)
    console.log("İşlenmiş ziyaretçi IP:", ip)

    try {
      // Önce bu IP'nin daha önce kaydedilip kaydedilmediğini kontrol edelim
      const checkQuery = "SELECT * FROM visitors WHERE ip_address = $1"
      const checkResult = await db.query(checkQuery, [ip])

      let query
      let isNewVisitor = false
      if (checkResult.rows.length === 0) {
        // Yeni ziyaretçi, yeni kayıt ekleyelim
        query = "INSERT INTO visitors (ip_address, visit_time) VALUES ($1, CURRENT_TIMESTAMP)"
        isNewVisitor = true
      } else {
        // Mevcut ziyaretçi, sadece zamanı güncelleyelim
        query = "UPDATE visitors SET visit_time = CURRENT_TIMESTAMP WHERE ip_address = $1"
      }

      await db.query(query, [ip])

      res
        .status(200)
        .json({ message: isNewVisitor ? "Yeni ziyaretçi kaydedildi" : "Ziyaretçi güncellendi", ip, isNewVisitor })
    } catch (error) {
      console.error("Hata:", error)
      res
        .status(500)
        .json({ error: "Bir hata oluştu.", details: error instanceof Error ? error.message : String(error) })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

