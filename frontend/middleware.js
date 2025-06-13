import { NextResponse } from 'next/server';


export function middleware(request) {
  const token = request.cookies.get('accessToken')?.value;
  if (!token && request.nextUrl.pathname.startsWith('/feed')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  return NextResponse.next();
}

// exécuté automatiquement pour chaque requête côté serveur pour /feed
export const config = {
  matcher: ['/feed'],
};