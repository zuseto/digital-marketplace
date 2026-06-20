import { getOrders } from "@/lib/admin-data";
import { formatRupiah, formatDate } from "@/lib/utils";
import OrderStatusControl from "@/components/admin/OrderStatusControl";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; status?: string }>;

const STATUSES = ["", "PENDING", "PAID", "FAILED", "EXPIRED"];

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const orders = await getOrders({ search: sp.q, status: sp.status });

  return (
    <>
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1">Transaksi</h1>
        <p className="text-muted-2 mb-0">Kelola & pantau seluruh pesanan.</p>
      </div>

      <form className="d-flex flex-wrap gap-2 mb-3" method="get">
        <div className="position-relative flex-grow-1" style={{ maxWidth: 360 }}>
          <i className="bi bi-search position-absolute text-muted-2" style={{ left: 14, top: "50%", transform: "translateY(-50%)" }} />
          <input name="q" defaultValue={sp.q} className="form-control ps-5" placeholder="Cari invoice, nama, atau email..." />
        </div>
        <select name="status" defaultValue={sp.status ?? ""} className="form-select" style={{ maxWidth: 180 }}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s || "Semua status"}</option>
          ))}
        </select>
        <button className="btn btn-brand"><i className="bi bi-funnel me-1" />Filter</button>
      </form>

      <div className="stat-card p-0">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="text-muted-2 small">
                <th className="ps-3">Invoice</th><th>Customer</th><th>Produk</th><th>Total</th><th>Status</th><th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-muted-2 py-5">Tidak ada transaksi.</td></tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td className="ps-3">
                      <div className="fw-semibold small">{o.invoice}</div>
                      {o.couponCode && <div className="text-success" style={{ fontSize: ".72rem" }}><i className="bi bi-ticket-perforated me-1" />{o.couponCode}</div>}
                    </td>
                    <td>
                      <div className="small fw-semibold">{o.customerName}</div>
                      <div className="text-muted-2" style={{ fontSize: ".75rem" }}>{o.email}</div>
                    </td>
                    <td className="small text-truncate" style={{ maxWidth: 180 }}>{o.product.name}</td>
                    <td className="small fw-semibold">{formatRupiah(o.amount)}</td>
                    <td><OrderStatusControl id={o.id} status={o.paymentStatus} /></td>
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
