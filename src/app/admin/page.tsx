import Link from "next/link";
import Image from "next/image";
import { getDashboardStats, getBestSellers, getRecentOrders, getRevenueSeries } from "@/lib/admin-data";
import { formatRupiah, formatDate } from "@/lib/utils";
import RevenueChart from "@/components/admin/RevenueChart";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [stats, bestSellers, recent, series] = await Promise.all([
    getDashboardStats(),
    getBestSellers(5),
    getRecentOrders(6),
    getRevenueSeries(14),
  ]);

  const cards = [
    { label: "Total Pendapatan", value: formatRupiah(stats.totalRevenue), icon: "bi-cash-stack", color: "#16a34a" },
    { label: "Transaksi Lunas", value: stats.paidOrders, icon: "bi-bag-check", color: "#6366f1" },
    { label: "Menunggu Bayar", value: stats.pendingOrders, icon: "bi-hourglass-split", color: "#d97706" },
    { label: "Total Produk", value: stats.totalProducts, icon: "bi-box-seam", color: "#0ea5e9" },
  ];

  return (
    <>
      <h1 className="h3 fw-bold mb-1">Dashboard</h1>
      <p className="text-muted-2 mb-4">Ringkasan performa toko digitalmu.</p>

      <div className="row g-3 mb-4">
        {cards.map((c) => (
          <div className="col-6 col-xl-3" key={c.label}>
            <div className="stat-card h-100">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="text-muted-2 small mb-1">{c.label}</div>
                  <div className="h4 fw-bold mb-0">{c.value}</div>
                </div>
                <span className="feature-icon" style={{ background: `${c.color}1a`, color: c.color }}>
                  <i className={`bi ${c.icon}`} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="stat-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h6 fw-bold mb-0">Pendapatan 14 Hari Terakhir</h2>
              <span className="status-badge status-PAID">PAID</span>
            </div>
            <RevenueChart data={series} />
          </div>
        </div>

        <div className="col-lg-4">
          <div className="stat-card h-100">
            <h2 className="h6 fw-bold mb-3">Produk Terlaris</h2>
            {bestSellers.length === 0 ? (
              <p className="text-muted-2 small mb-0">Belum ada penjualan.</p>
            ) : (
              <div className="d-grid gap-3">
                {bestSellers.map((b, i) => (
                  <div className="d-flex align-items-center gap-2" key={i}>
                    <Image
                      src={b.product?.thumbnail || "https://picsum.photos/seed/bs/80/80"}
                      alt={b.product?.name ?? ""}
                      width={42}
                      height={42}
                      className="rounded"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="flex-grow-1 min-w-0">
                      <div className="small fw-semibold text-truncate">{b.product?.name ?? "—"}</div>
                      <div className="text-muted-2" style={{ fontSize: ".78rem" }}>{b.sold} terjual</div>
                    </div>
                    <div className="small fw-bold">{formatRupiah(b.revenue)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="stat-card mt-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h6 fw-bold mb-0">Transaksi Terbaru</h2>
          <Link href="/admin/order" className="btn btn-ghost btn-sm">Lihat semua <i className="bi bi-arrow-right" /></Link>
        </div>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="text-muted-2 small">
                <th>Invoice</th><th>Customer</th><th>Produk</th><th>Total</th><th>Status</th><th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-muted-2 py-4">Belum ada transaksi.</td></tr>
              ) : (
                recent.map((o) => (
                  <tr key={o.id}>
                    <td className="small fw-semibold">{o.invoice}</td>
                    <td className="small">{o.customerName}</td>
                    <td className="small text-truncate" style={{ maxWidth: 160 }}>{o.product.name}</td>
                    <td className="small fw-semibold">{formatRupiah(o.amount)}</td>
                    <td><span className={`status-badge status-${o.paymentStatus}`}>{o.paymentStatus}</span></td>
                    <td className="small text-muted-2">{formatDate(o.createdAt)}</td>
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
