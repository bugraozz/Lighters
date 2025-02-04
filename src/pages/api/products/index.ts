import db from '../../../lib/db';
import { verifyAuth } from '../../../lib/auth';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`Received ${req.method} request with query:`, req.query);
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

      console.log('Executing query:', query, 'with params:', params);
      const result = await db.query(query, params);
      console.log('Query result:', result.rows);
      res.status(200).json(result.rows.length ? result.rows : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
      res.status(500).json({ error: 'Database error', details: errorMessage });
    }
  } else if (req.method === 'POST') {
    console.log('POST request received');
    const { authenticated, error } = verifyAuth(req);
    if (!authenticated) {
      console.log('Authentication failed:', error);
      return res.status(401).json({ error });
    }

    const { name, price, images, category, type, description, link } = req.body;
    console.log('Request body:', req.body);
  
    if (!type) {
      return res.status(400).json({ error: 'type bilgisi eksik.' });
    }
  
    try {
      await db.query('BEGIN');

     
      const productResult = await db.query(
        'INSERT INTO "Products" (name, price, category, type, description, link) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [name, price, category, type, description, link]
      );
      
      console.log('Query result:', productResult.rows);
      
      if (!productResult.rows.length) {
        throw new Error("Product insertion failed, no rows returned.");
      }
      
      const product = productResult.rows[0] as unknown as { id: number };
      
      if (!product.id) {
        throw new Error("Product ID is undefined after insertion.");
      }
      
      console.log('Inserted product:', product);
      
      for (let i = 0; i < images.length; i++) {
        await db.query(
          'INSERT INTO "ProductImages" (product_id, image_url, order_index) VALUES ($1, $2, $3)',
          [product.id, images[i], i]
        );
      }
      

      await db.query('COMMIT');
      console.log('Transaction committed');

      res.status(201).json(product);
    } catch (error) {
      await db.query('ROLLBACK');
      console.error('Error adding product:', error);
      const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
      res.status(500).json({ error: 'Database error', details: errorMessage });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}



