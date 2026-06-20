import Link from "next/link";
import Image from "next/image";
import { formatRupiah, truncate } from "@/lib/utils";

export interface ProductCardData {
  slug: string;
  name: string;
  description: string;
  price: number;
  thumbnail: string | null;
  featured?: boolean;
  category?: { name: string } | null;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <article className="card-elevated product-card h-100 d-flex flex-column">
      <Link href={`/produk/${product.slug}`} className="thumb d-block">
        <Image
          src={product.thumbnail || "https://picsum.photos/seed/placeholder/800/600"}
          alt={product.name}
          width={800}
          height={600}
          className="img-fluid"
        />
        {product.category && <span className="badge-cat">{product.category.name}</span>}
        {product.featured && (
          <span
            className="badge-cat"
            style={{ left: "auto", right: "0.75rem", background: "var(--brand-600)", color: "#fff" }}
          >
            <i className="bi bi-star-fill me-1" />Unggulan
          </span>
        )}
      </Link>
      <div className="p-3 p-lg-4 d-flex flex-column flex-grow-1">
        <h3 className="h6 fw-bold mb-2 lh-sm">
          <Link href={`/produk/${product.slug}`} className="text-ink stretched-link-none">
            {product.name}
          </Link>
        </h3>
        <p className="text-muted-2 small mb-3 flex-grow-1">{truncate(product.description, 90)}</p>
        <div className="d-flex align-items-center justify-content-between mt-auto">
          <span className="price-tag">{formatRupiah(product.price)}</span>
          <Link href={`/produk/${product.slug}`} className="btn btn-outline-ink btn-sm">
            Beli <i className="bi bi-arrow-right ms-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
