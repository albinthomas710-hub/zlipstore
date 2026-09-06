import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function PUT(request: Request) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Expected an array of FAQs" }, { status: 400 });
    }
    
    await db.updateFAQSorter(body);
    revalidatePath("/faq");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering FAQs:", error);
    return NextResponse.json({ error: "Failed to reorder FAQs" }, { status: 500 });
  }
}
