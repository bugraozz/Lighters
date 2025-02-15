import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user')?.value;
  const forwarded = request.headers.get('x-forwarded-for');

  if (['/login', '/admin/login'].includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (forwarded) {
    request.headers.set('client-ip', forwarded.split(',')[0].trim()); // İlk IP’yi al ve düzelt
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
    
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const parsedUser = JSON.parse(user);
      
      if (parsedUser.role !== 'admin') {
        
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      console.error(error);
      
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/admin/login','/api/:path*'],
};
