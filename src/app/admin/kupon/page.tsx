import { getAdminCoupons } from "@/lib/admin-data";
import { createCoupon, toggleCoupon, deleteCoupon } from "@/app/admin/coupon-actions";
import ConfirmAction from "@/components/admin/ConfirmAction";
import { formatRupiah } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await getAdminCoupons();

  return (
    <>
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1">Kupon Diskon</h1>
        <p className="text-muted-2 mb-0">Buat kode promo untuk pelanggan.</p>
      </div>

      <div className="row g-3">
        <div className="col-lg-4">
          <div className="stat-card">
            <h2 className="h6 fw-bold mb-3">Buat Kupon</h2>
            <form action={createCoupon}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Kode</label>
                <input name="code" required className="form-control text-uppercase" placeholder="HEMAT10" />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Tipe</label>
                <select name="type" className="form-select">
                  <option value="PERCENT">Persen (%)</option>
                  <option value="FIXED">Nominal (Rp)</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Nilai</label>
                <input name="value" type="number" min={1} required className="form-control" placeholder="10" />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Batas Pemakaian <span className="text-muted-2 fw-normal">(opsional)</span></label>
                <input name="maxUses" type="number" min={1} className="form-control" placeholder="Tak terbatas jika kosong" />
              </div>
              <button className="btn btn-brand w-100"><i className="bi bi-plus-lg me-1" />Buat Kupon</button>
            </form>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="stat-card p-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr className="text-muted-2 small">
                    <th className="ps-3">Kode</th><th>Diskon</th><th>Dipakai</th><th>Status</th><th className="text-end pe-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.length === 0 ? (
                    <tr><td colSpan={5} className="text-center text-muted-2 py-5">Belum ada kupon.</td></tr>
                  ) : (
                    coupons.map((c) => (
                      <tr key={c.id}>
                        <td className="ps-3 fw-bold small">{c.code}</td>
                        <td className="small">{c.type === "PERCENT" ? `${c.value}%` : formatRupiah(c.value)}</td>
                        <td className="small text-muted-2">{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""}</td>
                        <td><span className={`status-badge ${c.active ? "status-PAID" : "status-EXPIRED"}`}>{c.active ? "AKTIF" : "NONAKTIF"}</span></td>
                        <td className="text-end pe-3">
                          <div className="d-flex gap-1 justify-content-end">
                            <ConfirmAction
                              action={toggleCoupon}
                              id={c.id}
                              confirmText={`${c.active ? "Nonaktifkan" : "Aktifkan"} kupon ${c.code}?`}
                              successText="Status kupon diperbarui"
                              className="btn btn-sm btn-outline-ink"
                              icon={c.active ? "bi-pause" : "bi-play"}
                            />
                            <ConfirmAction
                              action={deleteCoupon}
                              id={c.id}
                              confirmText={`Hapus kupon ${c.code}?`}
                              successText="Kupon dihapus"
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
