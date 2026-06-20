import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getRelatedProducts, incrementView } from "@/lib/data";
import { formatRupiah, formatFileSize, truncate } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produk tidak ditemukan" };

  const desc = truncate(product.description, 160);
  return {
    title: product.name,
    description: desc,
    alternates: { canonical: `/produk/${product.slug}` },
    openGraph: {
      title: product.name,
      description: desc,
      type: "website",
      images: product.thumbnail ? [{ url: product.thumbnail }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Tambah penghitung view (fire-and-forget).
  void incrementView(slug);

  const related = await getRelatedProducts(product.categoryId, slug, 3);
  const gallery = product.gallery.length ? product.gallery : product.thumbnail ? [product.thumbnail] : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: truncate(product.description, 200),
    image: product.thumbnail ?? undefined,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="section-sm">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container container-tight">
        {/* Breadcrumb */}
        <nav className="small text-muted-2 mb-4" aria-label="breadcrumb">
          <Link href="/" className="text-muted-2">Beranda</Link> <i className="bi bi-chevron-right mx-1" />
          <Link href="/produk" className="text-muted-2">Produk</Link> <i className="bi bi-chevron-right mx-1" />
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="row g-5">
          {/* Gallery */}
          <div className="col-lg-7">
            <Reveal><ProductGallery images={gallery} alt={product.name} /></Reveal>

            <Reveal className="mt-5">
              <h2 className="h4 fw-bold mb-3">Deskripsi Produk</h2>
              <p className="text-muted-2" style={{ whiteSpace: "pre-line" }}>{product.description}</p>

              {product.features.length > 0 && (
                <>
                  <h3 className="h5 fw-bold mt-4 mb-3">Yang Kamu Dapatkan</h3>
                  <div className="row g-2">
                    {product.features.map((f, i) => (
                      <div className="col-md-6" key={i}>
                        <div className="d-flex align-items-start gap-2">
                          <i className="bi bi-check-circle-fill text-success mt-1" />
                          <span>{f}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Reveal>
          </div>

          {/* Sidebar beli */}
          <div className="col-lg-5">
            <div className="position-sticky" style={{ top: 90 }}>
              <Reveal delay={80}>
                <div className="card-elevated p-4">
                  {product.category && (
                    <span className="chip mb-2">
                      <i className="bi bi-tag" /> {product.category.name}
                    </span>
                  )}
                  <h1 className="h3 fw-bold mb-2">{product.name}</h1>
                  <div className="d-flex align-items-center gap-2 text-muted-2 small mb-3">
                    <span><i className="bi bi-eye me-1" />{product.views} dilihat</span>
                    <span>·</span>
                    <span className="text-warning">
                      <i className="bi bi-star-fill" /> 4.9
                    </span>
                  </div>

                  <div className="price-tag mb-1" style={{ fontSize: "2rem" }}>
                    {formatRupiah(product.price)}
                  </div>
                  <p className="small text-muted-2 mb-4">Pembayaran sekali, akses selamanya.</p>

                  <Link href={`/checkout?produk=${product.slug}`} className="btn btn-brand btn-lg w-100 mb-3">
                    <i className="bi bi-lightning-charge-fill me-2" />Beli Sekarang
                  </Link>

                  <ul className="list-unstyled d-grid gap-2 small text-muted-2 mb-0">
                    <li><i className="bi bi-shield-check text-success me-2" />Pembayaran aman & terenkripsi</li>
                    <li><i className="bi bi-download text-success me-2" />Download instan setelah bayar</li>
                    <li><i className="bi bi-arrow-repeat text-success me-2" />Update seumur hidup</li>
                  </ul>

                  {product.fileName && (
                    <div className="mt-4 p-3 rounded" style={{ background: "var(--surface-2)" }}>
                      <div className="small text-muted-2 mb-1">File yang didapat</div>
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-file-earmark-zip fs-4 text-primary" />
                        <div>
                          <div className="fw-semibold small">{product.fileName}</div>
                          <div className="text-muted-2" style={{ fontSize: ".78rem" }}>
                            {formatFileSize(product.fileSize)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-5 pt-4">
            <h2 className="h4 fw-bold mb-4">Produk Terkait</h2>
            <div className="row g-4">
              {related.map((p, i) => (
                <div className="col-sm-6 col-lg-4" key={p.slug}>
                  <Reveal delay={i * 60}><ProductCard product={p} /></Reveal>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
