// import type { NextApiRequest, NextApiResponse } from "next"
// import db from "../../../../lib/db"

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "GET") {
//     try {
//       console.log("API: Fetching total users...")
//       const query = `SELECT COUNT(*) AS total_users FROM "Users" `;
 
//       const result = await db.query(query)
      

//       const total_users = result.rows[0]?.total_users || 0;

      


//       res.status(200).json({ total_users })
//     } catch (error) {
//       console.error("API: Database error:", error)
//       const errorMessage = error instanceof Error ? error.message : "Unknown error";
//       res.status(500).json({ message: "Internal Server Error", error: errorMessage })
//     }
//   } else {
//     res.status(405).json({ message: "Method not allowed" })
// } 
// }

import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../lib/db";

type UserCountResult = { total_users: number };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      console.log("API: Fetching total users...");
      const query = `SELECT COUNT(*) AS total_users FROM "Users"`;

      const result = await db.query(query);

      const total_users = (result.rows[0] as unknown as UserCountResult)?.total_users ?? 0;

      res.status(200).json({ total_users });
    } catch (error) {
      console.error("API: Database error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ message: "Internal Server Error", error: errorMessage });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
