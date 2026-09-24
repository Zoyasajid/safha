import { AdminProductForm } from "@/components/admin/admin-product-form";
import { requireAdmin } from "@/lib/admin/auth";
import { readDb } from "@/lib/admin/store";
import { notFound, redirect } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/admin/login");
  const db = await readDb();
  const { id } = await params;
  const product = db.products.find((item) => item.id === id);
  if (!product) notFound();
  return (
    <AdminProductForm
      product={product}
      authors={db.authors}
      categories={db.categories}
    />
  );
}
