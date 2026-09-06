import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { put } from "@vercel/blob";

// 5MB max file size
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

const IS_VERCEL = process.env.VERCEL === "1";

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Sanitize filename to prevent path traversal
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${Date.now()}-${sanitizedName}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Use Vercel Blob for persistent storage in production
      const blob = await put(filename, buffer, {
        access: 'public',
        contentType: file.type,
      });
      return NextResponse.json({ url: blob.url });
    } else if (IS_VERCEL) {
      // On Vercel without Blob (Ephemeral fallback)
      const tmpDir = "/tmp/uploads";
      if (!existsSync(tmpDir)) {
        await mkdir(tmpDir, { recursive: true });
      }
      await writeFile(path.join(tmpDir, filename), buffer);
      return NextResponse.json({ url: `/api/uploads/${filename}` });
    } else {
      // Local dev: write to public/uploads and serve statically
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      await writeFile(path.join(uploadDir, filename), buffer);
      return NextResponse.json({ url: `/uploads/${filename}` });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
