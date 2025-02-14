import type { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../lib/db"

interface QueryResult {
  rows: Array<{ count: string }>
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Tüm zamanların toplam ziyaretçi sayısı
      const totalQuery = "SELECT COUNT(DISTINCT ip_address) AS count FROM visitors"
      const totalResult = (await db.query(totalQuery)) as unknown as QueryResult
      const totalVisitors = Number(totalResult.rows[0]?.count) || 0

      // Son 24 saatteki aktif ziyaretçi sayısı
      const activeQuery = `
        SELECT COUNT(DISTINCT ip_address) AS count 
        FROM visitors 
        WHERE visit_time > NOW() - INTERVAL '24 hours'
      `
      const activeResult = (await db.query(activeQuery)) as unknown as QueryResult
      const activeVisitors = Number(activeResult.rows[0]?.count) || 0

      res.status(200).json({ totalVisitors, activeVisitors })
    } catch (error) {
      console.error("Hata:", error)
      res.status(500).json({ error: "Bir hata oluştu." })
    }
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

