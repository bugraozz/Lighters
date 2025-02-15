// import type { NextApiRequest, NextApiResponse } from "next"
// import db from "../../../../lib/db"

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   console.log("admin-track API çağrıldı")

//   if (req.method === "POST") {
//     const getClientIp = (req: NextApiRequest) => {
//       const forwarded = req.headers["x-forwarded-for"];
//       if (typeof forwarded === "string") {
//         return forwarded.split(",")[0].trim(); // İlk IP’yi al
//       }
//       return req.socket.remoteAddress; // Eğer yoksa fallback olarak
//     };
    
//     const ip = getClientIp(req);
//     console.log("Gerçek IP Adresi:", ip);
    

//     console.log("İşlenmiş ziyaretçi IP:", ip)

//     try {
//       // Önce bu IP'nin daha önce kaydedilip kaydedilmediğini kontrol edelim
//       const checkQuery = "SELECT * FROM visitors WHERE ip_address = $1"
//       const checkResult = await db.query(checkQuery, [ip])

//       const isNewVisitor = checkResult.rows.length === 0

//       const query = isNewVisitor
//         ? "INSERT INTO visitors (ip_address, visit_time) VALUES ($1, CURRENT_TIMESTAMP)"
//         : "UPDATE visitors SET visit_time = CURRENT_TIMESTAMP WHERE ip_address = $1"

//       await db.query(query, [ip])

//       console.log(`Ziyaretçi ${isNewVisitor ? "eklendi" : "güncellendi"}:`, ip)

//       res
//         .status(200)
//         .json({ message: isNewVisitor ? "Yeni ziyaretçi kaydedildi" : "Ziyaretçi güncellendi", ip, isNewVisitor })
//     } catch (error) {
//       console.error("Veritabanı hatası:", error)
//       res
//         .status(500)
//         .json({ error: "Bir hata oluştu.", details: error instanceof Error ? error.message : String(error) })
//     }
//   } else {
//     res.setHeader("Allow", ["POST"])
//     res.status(405).end(`Method ${req.method} Not Allowed`)
//   }
// }



import { NextApiRequest, NextApiResponse } from 'next';
import db from "../../../../lib/db";

const getClientIp = (req: NextApiRequest): string | null => {
  const forwarded = req.headers['x-forwarded-for']; // Proxy veya Load Balancer varsa
 

  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim(); // Listenin ilk IP’sini al
  }

  const rawIp = req.socket.remoteAddress;
  if (!rawIp) return null;

  return rawIp.includes('::ffff:') ? rawIp.split('::ffff:')[1] : rawIp; // IPv6 formatını düzelt
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const ip = getClientIp(req);
    if (!ip) {
      return res.status(400).json({ message: 'IP adresi alınamadı' });
    }

    console.log('Gerçek IP:', ip);

    // Veritabanında IP'yi kontrol et
    const checkQuery = "SELECT * FROM visitors WHERE ip_address = $1";
    const checkResult = await db.query(checkQuery, [ip]);

    if (checkResult.rows.length > 0) {
      // Mevcut ziyaretçiyi güncelle
      const updateQuery = "UPDATE visitors SET visit_time = CURRENT_TIMESTAMP WHERE ip_address = $1";
      await db.query(updateQuery, [ip]);

      return res.json({ message: 'Ziyaretçi güncellendi', ip, isNewVisitor: false });
    } else {
      // Yeni ziyaretçi ekle
      const insertQuery = "INSERT INTO visitors (ip_address, visit_time) VALUES ($1, CURRENT_TIMESTAMP)";
      await db.query(insertQuery, [ip]);

      return res.json({ message: 'Yeni ziyaretçi kaydedildi', ip, isNewVisitor: true });
    }
  } catch (error) {
    console.error('Ziyaretçi takibi hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}
