import { NextApiRequest, NextApiResponse } from 'next';
import db from "../../../../lib/db";

const getClientIp = (req: NextApiRequest): string | null => {
  let ip: string | null = null;

  // Cloudflare başlığı kontrolü
  if (req.headers['cf-connecting-ip']) {
    ip = req.headers['cf-connecting-ip'] as string;
    console.log("Cloudflare IP:", ip);
  }

  // X-Forwarded-For başlığını kontrol et (proxy üzerinden gelen)
  if (!ip && req.headers['x-forwarded-for']) {
    const forwarded = req.headers['x-forwarded-for'] as string;
    ip = forwarded.split(',')[0].trim(); // İlk IP'yi al
    console.log("X-Forwarded-For IP:", ip);
  }

  // X-Real-IP başlığını kontrol et (bazı proxy'ler bu başlığı kullanır)
  if (!ip && req.headers['x-real-ip']) {
    ip = req.headers['x-real-ip'] as string;
    console.log("X-Real-IP:", ip);
  }

  // Eğer hala IP alınamadıysa, socket üzerinden IP al
  if (!ip) {
    ip = req.socket.remoteAddress ?? null;
    console.log("Socket IP:", ip);
  }

  // IPv6'dan IPv4'e dönüşüm yap (eğer gerekiyorsa)
  if (ip?.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
    console.log("IPv4 IP:", ip);
  }

  // IP'nin 127.0.0.1 veya localhost olmamasını kontrol et
  if (ip === "127.0.0.1" || ip === "::1") {
    console.error("IP adresi geçersiz, localhost olarak algılanmış.");
    return null;
  }

  console.log('İstemci IP:', ip);
  return ip;
};




export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Başlıklar:', req.headers);
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
