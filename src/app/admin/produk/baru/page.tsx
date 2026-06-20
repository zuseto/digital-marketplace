import { getAdminCategories } from "@/lib/admin-data";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getAdminCategories();
  return (
    <>
      <h1 className="h3 fw-bold mb-4">Tambah Produk</h1>
      <ProductForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
    </>
  );
}
