import { getAdminCategories } from "@/lib/admin-data";
import { createCategory, deleteCategory } from "@/app/admin/category-actions";
import ConfirmAction from "@/components/admin/ConfirmAction";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <>
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1">Kategori</h1>
        <p className="text-muted-2 mb-0">Kelompokkan produk berdasarkan kategori.</p>
      </div>

      <div className="row g-3">
        <div className="col-lg-4">
          <div className="stat-card">
            <h2 className="h6 fw-bold mb-3">Tambah Kategori</h2>
            <form action={createCategory}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Nama Kategori</label>
                <input name="name" required className="form-control" placeholder="Mis. Template Email" />
              </div>
              <button className="btn btn-brand w-100"><i className="bi bi-plus-lg me-1" />Tambah</button>
            </form>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="stat-card p-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr className="text-muted-2 small">
                    <th className="ps-3">Nama</th><th>Slug</th><th>Produk</th><th className="text-end pe-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr><td colSpan={4} className="text-center text-muted-2 py-5">Belum ada kategori.</td></tr>
                  ) : (
                    categories.map((c) => (
                      <tr key={c.id}>
                        <td className="ps-3 fw-semibold small">{c.name}</td>
                        <td className="small text-muted-2"><code>{c.slug}</code></td>
                        <td className="small">{c._count.products}</td>
                        <td className="text-end pe-3">
                          <ConfirmAction
                            action={deleteCategory}
                            id={c.id}
                            confirmText={`Hapus kategori "${c.name}"? Produk terkait akan kehilangan kategori.`}
                            successText="Kategori dihapus"
                          />
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
