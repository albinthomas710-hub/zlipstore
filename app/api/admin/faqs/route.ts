import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const faqs = await db.getFAQs();
    return NextResponse.json(faqs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    if (!body.question || !body.answer) {
      return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
    }
    
    // Auto-assign sort order if not provided
    let sortOrder = body.sortOrder;
    if (typeof sortOrder !== 'number') {
      const existing = await db.getFAQs();
      sortOrder = existing.length > 0 ? Math.max(...existing.map(f => f.sortOrder)) + 1 : 1;
    }
    
    const newFaq = await db.createFAQ({
      question: body.question,
      answer: body.answer,
      sortOrder
    });
    
    revalidatePath("/faq");
    return NextResponse.json(newFaq, { status: 201 });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
  }
}
