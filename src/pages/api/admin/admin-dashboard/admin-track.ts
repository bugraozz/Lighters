import type { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("admin-track API çağrıldı")

  if (req.method === "POST") {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = typeof forwarded === "string" ? forwarded.split(",")[0] : req.socket.remoteAddress;

    console.log("İşlenmiş ziyaretçi IP:", ip)

    try {
      // Önce bu IP'nin daha önce kaydedilip kaydedilmediğini kontrol edelim
      const checkQuery = "SELECT * FROM visitors WHERE ip_address = $1"
      const checkResult = await db.query(checkQuery, [ip])

      const isNewVisitor = checkResult.rows.length === 0

      const query = isNewVisitor
        ? "INSERT INTO visitors (ip_address, visit_time) VALUES ($1, CURRENT_TIMESTAMP)"
        : "UPDATE visitors SET visit_time = CURRENT_TIMESTAMP WHERE ip_address = $1"

      await db.query(query, [ip])

      console.log(`Ziyaretçi ${isNewVisitor ? "eklendi" : "güncellendi"}:`, ip)

      res
        .status(200)
        .json({ message: isNewVisitor ? "Yeni ziyaretçi kaydedildi" : "Ziyaretçi güncellendi", ip, isNewVisitor })
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

