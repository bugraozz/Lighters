import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: number
  role: string
  iat: number
  exp: number
}

import { NextApiRequest,NextApiResponse } from 'next';

export function verifyAuth(req: NextApiRequest) {
  const authHeader = req.headers.authorization;
 

  // Authorization başlığını kontrol edin
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    
    return { authenticated: false, error: 'Invalid or missing authorization header' };
  }

  // Tokeni ayıklayın
  const token = authHeader.split(' ')[1];
  

  try {
    // Token doğrulaması
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not set in environment variables');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
    

    return { authenticated: true, userId: decoded.id };
  } catch (error) {
    console.error('Token verification failed:', (error as Error).message);
    return { authenticated: false, error: 'Invalid or expired token' };
  }
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken
    
    return decoded
  } catch (error) {
    console.error('Token doğrulama hatası:', error)
    return null
  }
}


export function logout(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', 'token=; Max-Age=0; path=/'); // Token'ı temizle
  res.status(200).send({ message: 'Logged out successfully' });
}
