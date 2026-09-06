import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Proxy route to serve uploaded images from /tmp on Vercel
// (Vercel's public/ directory is read-only at runtime)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Strict sanitize: only allow safe characters
  if (!/^[\w.\-]+$/.test(filename)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = path.join("/tmp/uploads", filename);

  if (!existsSync(filePath)) {
    // Fallback: try the public/uploads directory (for dev)
    const publicPath = path.join(process.cwd(), "public/uploads", filename);
    if (!existsSync(publicPath)) {
      return new NextResponse("Not found", { status: 404 });
    }

    const buffer = await readFile(publicPath);
    const ext = filename.split(".").pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
      webp: "image/webp", gif: "image/gif",
    };
    const contentType = mimeTypes[ext || ""] || "application/octet-stream";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  const buffer = await readFile(filePath);
  const ext = filename.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
    webp: "image/webp", gif: "image/gif",
  };
  const contentType = mimeTypes[ext || ""] || "application/octet-stream";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
