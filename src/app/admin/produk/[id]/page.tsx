import { notFound } from "next/navigation";
import { getProductById, getAdminCategories } from "@/lib/admin-data";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), getAdminCategories()]);
  if (!product) notFound();

  return (
    <>
      <h1 className="h3 fw-bold mb-4">Edit Produk</h1>
      <ProductForm
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId,
          status: product.status,
          featured: product.featured,
          features: product.features,
          thumbnail: product.thumbnail,
          fileName: product.fileName,
        }}
      />
    </>
  );
}
