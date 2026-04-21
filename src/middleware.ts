import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Cek cookie sesi simulasi
  const session = request.cookies.get('shopfind_session')?.value;
  const { pathname } = request.nextUrl;

  // Izinkan akses bebas ke halaman login
  if (pathname.startsWith('/login')) {
    // Jika sudah login, paksa kembali ke dashboard
    if (session === 'active') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Jika belum login dan mencoba masuk halaman internal (seperti /)
  if (session !== 'active') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Hanya aktifkan middleware untuk rute halaman, abaikan file statis/api
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
