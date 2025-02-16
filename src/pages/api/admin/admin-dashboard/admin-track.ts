import { NextApiRequest, NextApiResponse } from 'next';
import db from "../../../../lib/db";

const getClientIp = (req: NextApiRequest): string | null => {
  let ip: string | null = null;

  // Cloudflare header
  if (req.headers['cf-connecting-ip']) {
    ip = req.headers['cf-connecting-ip'] as string;
  }

  // X-Forwarded-For header (proxy)
  if (!ip && req.headers['x-forwarded-for']) {
    const forwarded = req.headers['x-forwarded-for'] as string;
    ip = forwarded.split(',')[0].trim(); // Get the first IP
  }

  // X-Real-IP header (some proxies use this)
  if (!ip && req.headers['x-real-ip']) {
    ip = req.headers['x-real-ip'] as string;
  }

  // Fallback to socket remote address
  if (!ip) {
    ip = req.socket.remoteAddress ?? null;
  }

  // Convert IPv6 to IPv4 if necessary
  if (ip?.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }

  // Ensure IP is not localhost
  if (ip === "127.0.0.1" || ip === "::1") {
    return null;
  }

  return ip;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const ip = getClientIp(req);
    if (!ip) {
      return res.status(400).json({ message: 'Gerçek IP adresi alınamadı', receivedIp: ip });
    }

    console.log('Gerçek IP:', ip);

    // Check the database for the IP address
    const checkQuery = "SELECT * FROM visitors WHERE ip_address = $1";
    const checkResult = await db.query(checkQuery, [ip]);

    if (checkResult.rows.length > 0) {
      // Update existing visitor
      const updateQuery = "UPDATE visitors SET visit_time = CURRENT_TIMESTAMP WHERE ip_address = $1";
      await db.query(updateQuery, [ip]);
      return res.json({ message: 'Ziyaretçi güncellendi', ip, isNewVisitor: false });
    } else {
      // Add new visitor
      const insertQuery = "INSERT INTO visitors (ip_address, visit_time) VALUES ($1, CURRENT_TIMESTAMP)";
      await db.query(insertQuery, [ip]);
      return res.json({ message: 'Yeni ziyaretçi kaydedildi', ip, isNewVisitor: true });
    }
  } catch (error) {
    console.error('Ziyaretçi takibi hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error instanceof Error ? error.message : String(error) });
  }
}
