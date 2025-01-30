import db from '@/lib/db';

export default async function handler(req, res) {
  try {
    const result = await db.query(`
     SELECT p.id, p.name, p.price, 
  COALESCE(ARRAY_AGG(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL), ARRAY[]::text[]) AS images
FROM "Products" p
LEFT JOIN "ProductImages" pi ON p.id = pi.product_id
GROUP BY p.id
ORDER BY RANDOM()
LIMIT 4;

    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    res.status(500).json({ message: 'Failed to fetch featured products' });
  }
}
