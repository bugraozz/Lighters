import type { NextApiRequest, NextApiResponse } from "next";
import db from '../../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const query = "SELECT COUNT(*) AS count FROM visitors";
      const result = await db.query(query);
      const totalVisitors = Number((result.rows[0] as unknown as { count: number }).count) || 0;

      res.status(200).json({ totalVisitors });
    } catch (error) {
      console.error("Hata:", error);
      res.status(500).json({ error: "Bir hata oluştu." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
