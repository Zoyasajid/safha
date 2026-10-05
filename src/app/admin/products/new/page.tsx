import { AdminProductForm } from "@/components/admin/admin-product-form";
import { emptyProduct } from "@/app/api/admin/products/route";
import { requireAdmin } from "@/lib/admin/auth";
import { readFirestoreAuthors } from "@/lib/admin/firestore-authors";
import { readDb } from "@/lib/admin/store";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/admin/login");
  const [db, authors] = await Promise.all([readDb(), readFirestoreAuthors()]);
  const now = new Date().toISOString();
  return (
    <AdminProductForm
      product={emptyProduct("new-product", now)}
      authors={authors}
      categories={db.categories}
    />
  );
}
