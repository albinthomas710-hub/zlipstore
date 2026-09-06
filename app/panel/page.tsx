import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function AdminPanelPage() {
  const session = await verifySession();
  if (!session) {
    redirect("/panel/login");
  }

  const products = await db.getProducts();
  const faqs = await db.getFAQs();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <AdminDashboard initialProducts={products} initialFaqs={faqs} />
    </div>
  );
}
