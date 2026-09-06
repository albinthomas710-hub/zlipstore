import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const productData = await request.json();
    const updatedProduct = await db.updateProduct(id, productData);
    
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/category/[slug]", "page");
    revalidatePath("/product/[slug]", "page");
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await db.deleteProduct(id);
    
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/category/[slug]", "page");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
