import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const productData = await request.json();
    const newProduct = await db.createProduct(productData);
    
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/category/[slug]", "page");
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
