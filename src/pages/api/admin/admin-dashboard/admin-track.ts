import { NextApiRequest, NextApiResponse } from 'next';
import db from "../../../../lib/db";

const getClientIp = (req: NextApiRequest): string | null => {
  // Reverse Proxy veya doğrudan bağlantılar için IP al
  const forwarded = req.headers['x-forwarded-for'];

  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim(); // İlk IP'yi al
  }

  const rawIp = req.socket.remoteAddress;
  if (!rawIp) return null;

  // IPv6 formatını temizle (örneğin "::ffff:88.236.182.46" → "88.236.182.46")
  return rawIp.replace(/^::ffff:/, '');
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const ip = getClientIp(req);
    console.log('Gerçek IP:', ip);

    if (!ip) {
      return res.status(400).json({ message: 'IP adresi alınamadı' });
    }

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
    res.status(500).json({ message: 'Sunucu hatası', error: error instanceof Error ? error.message : String(error) });
  }
}
