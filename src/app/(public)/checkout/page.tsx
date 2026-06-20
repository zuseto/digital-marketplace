import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import { getProductBySlug } from "@/lib/data";
import { formatRupiah } from "@/lib/utils";
import { MIDTRANS_SNAP_URL } from "@/lib/midtrans";
import CheckoutForm from "@/components/CheckoutForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

type SearchParams = Promise<{ produk?: string }>;

export default async function CheckoutPage({ searchParams }: { searchParams: SearchParams }) {
  const { produk } = await searchParams;
  if (!produk) redirect("/produk");

  const product = await getProductBySlug(produk);
  if (!product || product.status !== "PUBLISHED") notFound();

  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";

  return (
    <div className="section-sm">
      <Script src={MIDTRANS_SNAP_URL} data-client-key={clientKey} strategy="afterInteractive" />
      <div className="container container-tight" style={{ maxWidth: 980 }}>
        <h1 className="h2 fw-bold mb-1">Checkout</h1>
        <p className="text-muted-2 mb-4">Selesaikan pembelianmu — tanpa perlu membuat akun.</p>

        <div className="row g-4">
          <div className="col-lg-7 order-2 order-lg-1">
            <div className="card-elevated p-4">
              <h2 className="h5 fw-bold mb-3">Data Pembeli</h2>
              <CheckoutForm
                productSlug={product.slug}
                price={product.price}
              />
            </div>
          </div>

          <div className="col-lg-5 order-1 order-lg-2">
            <div className="card-elevated p-4 position-sticky" style={{ top: 90 }}>
              <h2 className="h6 fw-bold mb-3">Ringkasan Pesanan</h2>
              <div className="d-flex gap-3 mb-3">
                <Image
                  src={product.thumbnail || "https://picsum.photos/seed/co/200/150"}
                  alt={product.name}
                  width={88}
                  height={66}
                  className="rounded"
                  style={{ objectFit: "cover" }}
                />
                <div>
                  <div className="fw-semibold lh-sm">{product.name}</div>
                  {product.category && <div className="small text-muted-2">{product.category.name}</div>}
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted-2">Harga</span>
                <span>{formatRupiah(product.price)}</span>
              </div>
              <div className="small text-muted-2">
                Total akhir & diskon kupon akan dihitung otomatis di sebelah kiri.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
