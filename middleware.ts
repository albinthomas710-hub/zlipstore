import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Block only the original client's link
  if (host === 'zlipstore.vercel.app') {
    return new NextResponse(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>404 Not Found</title>
      </head>
      <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1>404 Not Found</h1>
        <hr style="max-width: 500px; margin: 20px auto;">
        <p style="color: #666;">nginx</p>
      </body>
      </html>
    `, {
      status: 404,
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // Allow all other URLs (portfolio link, preview links etc.)
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
