import db from '../../../lib/db';
import { verifyAuth } from '../../../lib/auth';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { category, type, sizes } = req.query;
    try {
      let query = `
        SELECT p.*, 
               array_agg(DISTINCT pi.image_url) as images,
               json_agg(json_build_object('size', ps.size, 'stock', ps.stock)) as sizes
        FROM "Products" p 
        LEFT JOIN "ProductImages" pi ON p.id = pi.product_id
        LEFT JOIN "ProductSizes" ps ON p.id = ps.product_id
      `;
      const params = [];
      const conditions = [];

      if (category) {
        conditions.push(`p.category = $${params.length + 1}`);
        params.push(category);
      }
      if (type) {
        conditions.push(`p.type = $${params.length + 1}`);
        params.push(type);
      }
      if (sizes) {
        const sizesArray = typeof sizes === 'string' ? sizes.split(',') : sizes;
        conditions.push(`ps.size = ANY($${params.length + 1})`);
        params.push(sizesArray);
      }

      if (conditions.length) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      query += ' GROUP BY p.id';

      const result = await db.query(query, params);
      res.status(200).json(result.rows.length ? result.rows : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Database error', details: error.message });
    }
  } else if (req.method === 'POST') {
    const { authenticated, error, userId } = verifyAuth(req);
    if (!authenticated) {
      return res.status(401).json({ error });
    }

    const { name, price, images, category, type, description, link } = req.body;
  
    if (!type) {
      return res.status(400).json({ error: 'type bilgisi eksik.' });
    }
  
    try {
      await db.query('BEGIN');

      const productResult = await db.query(
        'INSERT INTO "Products" (name, price, category, type, description, link) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, price, category, type, description, link]
      );
      
      const product = productResult.rows[0];

      for (let i = 0; i < images.length; i++) {
        await db.query(
          'INSERT INTO "ProductImages" (product_id, image_url, order_index) VALUES ($1, $2, $3)',
          [product.id, images[i], i]
        );
      }

      await db.query('COMMIT');

      res.status(201).json(product);
    } catch (error) {
      await db.query('ROLLBACK');
      console.error('Error adding product:', error);
      res.status(500).json({ error: 'Database error', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}



