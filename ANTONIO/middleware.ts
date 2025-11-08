import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/'];
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

  // Se for rota pública, permitir acesso
  if (isPublicRoute) {
    return res;
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

