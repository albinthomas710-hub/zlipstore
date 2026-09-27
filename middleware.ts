import { NextResponse } from 'next/server';

export function middleware() {
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

export const config = {
  matcher: '/:path*',
};
