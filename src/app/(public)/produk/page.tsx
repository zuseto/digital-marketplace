import type { Metadata } from "next";
import { getProducts, getCategories } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Semua Produk Digital",
  description: "Jelajahi koleksi produk digital premium: template, source code, ebook, asset, dan prompt AI.",
};

type SearchParams = Promise<{ q?: string; kategori?: string; sort?: string }>;

export default async function ProductListPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts({
      search: sp.q,
      category: sp.kategori,
      sort: sp.sort as "newest" | "price-asc" | "price-desc" | undefined,
    }),
    getCategories(),
  ]);

  return (
    <div className="section">
      <div className="container container-tight">
        <div className="mb-4">
          <span className="eyebrow">Katalog</span>
          <h1 className="h1 mt-1 mb-2">Semua Produk</h1>
          <p className="text-muted-2">Temukan aset digital premium yang kamu butuhkan.</p>
        </div>

        <ProductFilters categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />

        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-muted-2 small">
            {products.length} produk ditemukan
            {sp.q ? ` untuk "${sp.q}"` : ""}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="card-elevated p-5 text-center">
            <i className="bi bi-search fs-1 text-muted-2 mb-2 d-block" />
            <h3 className="h5">Tidak ada produk yang cocok</h3>
            <p className="text-muted-2 mb-0">Coba ubah kata kunci atau filter kategori.</p>
          </div>
        ) : (
          <div className="row g-4">
            {products.map((p, i) => (
              <div className="col-sm-6 col-lg-4 col-xl-3" key={p.slug}>
                <Reveal delay={Math.min(i, 6) * 50}>
                  <ProductCard product={p} />
                </Reveal>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
