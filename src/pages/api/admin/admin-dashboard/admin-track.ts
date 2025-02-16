import { NextApiRequest, NextApiResponse } from 'next';
import db from "../../../../lib/db";

const getClientIp = (req: NextApiRequest): string | null => {
  let ip: string | null = null;

  // X-Forwarded-For başlığını kontrol et
  if (req.headers['x-forwarded-for']) {
    const forwarded = req.headers['x-forwarded-for'] as string;
    ip = forwarded.split(',')[0].trim(); // İlk IP'yi al
  }

  // X-Real-IP başlığını kontrol et
  if (!ip && req.headers['x-real-ip']) {
    ip = req.headers['x-real-ip'] as string;
  }

  // Eğer hala IP bulunamazsa, soket adresini kullan
  if (!ip) {
    ip = req.socket.remoteAddress ?? null;
  }

  // IPv6 formatından (::ffff:) temizle
  if (ip?.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", ""); 
  }

  console.log('İstemci IP:', ip);
  return ip;
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const ip = getClientIp(req);
    if (!ip || ip === "127.0.0.1") {
      return res.status(400).json({ message: 'Gerçek IP adresi alınamadı', receivedIp: ip });
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
    res.status(500).json({ message: 'Sunucu hatası', error: error instanceof Error ? error.message : String(error) });
  }
}
