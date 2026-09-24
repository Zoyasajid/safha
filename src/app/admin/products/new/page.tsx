import { AdminProductForm } from "@/components/admin/admin-product-form";
import { emptyProduct } from "@/app/api/admin/products/route";
import { requireAdmin } from "@/lib/admin/auth";
import { readDb } from "@/lib/admin/store";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/admin/login");
  const db = await readDb();
  const now = new Date().toISOString();
  return (
    <AdminProductForm
      product={emptyProduct("new-product", now)}
      authors={db.authors}
      categories={db.categories}
    />
  );
}
