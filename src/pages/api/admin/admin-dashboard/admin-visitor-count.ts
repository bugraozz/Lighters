import type { NextApiRequest, NextApiResponse } from "next"
import db from "../../../../lib/db"

interface QueryResult {
  rows: Array<{ count: string }>
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("admin-visitor-count API çağrıldı")

  if (req.method === "GET") {
    try {
      const totalQuery = "SELECT COUNT(*) AS count FROM visitors"
      const totalResult = (await db.query(totalQuery)) as unknown as QueryResult
      const totalVisitors = Number(totalResult.rows[0]?.count) || 0

      console.log("Toplam ziyaretçi sayısı:", totalVisitors)

      const activeQuery = `
        SELECT COUNT(*) AS count 
        FROM visitors 
        WHERE visit_time > NOW() - INTERVAL '6 hours'
      `
      const activeResult = (await db.query(activeQuery)) as unknown as QueryResult
      const activeVisitors = Number(activeResult.rows[0]?.count) || 0

      console.log("Aktif ziyaretçi sayısı:", activeVisitors)

      res.status(200).json({ totalVisitors, activeVisitors })
    } catch (error) {
      console.error("Veritabanı hatası:", error)
      res
        .status(500)
        .json({ error: "Bir hata oluştu.", details: error instanceof Error ? error.message : String(error) })
    }
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

