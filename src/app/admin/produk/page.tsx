import Link from "next/link";
import Image from "next/image";
import { getAdminProducts } from "@/lib/admin-data";
import { formatRupiah } from "@/lib/utils";
import ProductActions from "@/components/admin/ProductActions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Produk</h1>
          <p className="text-muted-2 mb-0">{products.length} produk terdaftar.</p>
        </div>
        <Link href="/admin/produk/baru" className="btn btn-brand">
          <i className="bi bi-plus-lg me-1" />Tambah Produk
        </Link>
      </div>

      <div className="stat-card p-0">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="text-muted-2 small">
                <th className="ps-3">Produk</th><th>Kategori</th><th>Harga</th><th>Views</th><th>Status</th><th className="text-end pe-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-muted-2 py-5">
                  Belum ada produk. <Link href="/admin/produk/baru">Tambah produk pertama</Link>.
                </td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id}>
                    <td className="ps-3">
                      <div className="d-flex align-items-center gap-2">
                        <Image
                          src={p.thumbnail || "https://picsum.photos/seed/p/80/80"}
                          alt={p.name}
                          width={44}
                          height={44}
                          className="rounded"
                          style={{ objectFit: "cover" }}
                        />
                        <div className="fw-semibold small text-truncate" style={{ maxWidth: 220 }}>{p.name}</div>
                      </div>
                    </td>
                    <td className="small text-muted-2">{p.category?.name ?? "—"}</td>
                    <td className="small fw-semibold">{formatRupiah(p.price)}</td>
                    <td className="small text-muted-2">{p.views}</td>
                    <td><span className={`status-badge status-${p.status}`}>{p.status}</span></td>
                    <td className="pe-3"><ProductActions id={p.id} status={p.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
