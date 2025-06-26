import { NextResponse } from 'next/server';

// Middleware exécuté côté serveur à chaque requête vers une route protégée
export function middleware(request) {
  const token = request.cookies.get('accessToken')?.value;

  // Si aucun token et que l'utilisateur tente d'accéder à /feed, on redirige vers /auth/login
  if (!token && request.nextUrl.pathname.startsWith('/feed')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Sinon, la requête continue normalement
  return NextResponse.next();
}

// Ce middleware s'applique uniquement à /feed (et ses sous-routes si présentes)
export const config = {
  matcher: ['/feed'],
};
