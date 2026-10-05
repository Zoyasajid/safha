import { AdminProductForm } from "@/components/admin/admin-product-form";
import { requireAdmin } from "@/lib/admin/auth";
import { readFirestoreAuthors } from "@/lib/admin/firestore-authors";
import { readDb } from "@/lib/admin/store";
import { notFound, redirect } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/admin/login");
  const [db, authors] = await Promise.all([readDb(), readFirestoreAuthors()]);
  const { id } = await params;
  const product = db.products.find((item) => item.id === id);
  if (!product) notFound();
  return (
    <AdminProductForm
      product={product}
      authors={authors}
      categories={db.categories}
    />
  );
}
