"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { saveProduct } from "@/app/admin/product-actions";

interface Category {
  id: string;
  name: string;
}

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string | null;
  status: string;
  featured: boolean;
  features: string[];
  thumbnail: string | null;
  fileName: string | null;
}

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-brand" disabled={pending}>
      {pending ? <><span className="spinner-border spinner-border-sm me-2" />Menyimpan...</> : <><i className="bi bi-check-lg me-1" />Simpan Produk</>}
    </button>
  );
}

export default function ProductForm({ categories, product }: { categories: Category[]; product?: ProductData }) {
  return (
    <form action={saveProduct}>
      {product && <input type="hidden" name="id" value={product.id} />}
      <div className="row g-3">
        <div className="col-lg-8">
          <div className="stat-card mb-3">
            <h2 className="h6 fw-bold mb-3">Informasi Dasar</h2>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Nama Produk</label>
              <input name="name" required defaultValue={product?.name} className="form-control" placeholder="Mis. Template SaaS Premium" />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Slug <span className="text-muted-2 fw-normal">(opsional, otomatis dari nama)</span></label>
              <input name="slug" defaultValue={product?.slug} className="form-control" placeholder="template-saas-premium" />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Deskripsi</label>
              <textarea name="description" required defaultValue={product?.description} className="form-control" rows={6} placeholder="Jelaskan produkmu..." />
            </div>
            <div className="mb-0">
              <label className="form-label small fw-semibold">Fitur <span className="text-muted-2 fw-normal">(satu per baris)</span></label>
              <textarea name="features" defaultValue={product?.features.join("\n")} className="form-control" rows={4} placeholder={"Responsive design\nGratis update\nLisensi komersial"} />
            </div>
          </div>

          <div className="stat-card">
            <h2 className="h6 fw-bold mb-3">File & Media</h2>
            <div className="mb-3">
              <label className="form-label small fw-semibold">URL Thumbnail</label>
              <input name="thumbnailUrl" defaultValue={product?.thumbnail ?? ""} className="form-control" placeholder="https://..." />
              <div className="form-text">Atau unggah file gambar di bawah (mengganti URL).</div>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Upload Thumbnail</label>
              <input name="thumbnailFile" type="file" accept="image/*" className="form-control" />
            </div>
            <hr />
            <div className="mb-0">
              <label className="form-label small fw-semibold">File Digital (ZIP/PDF)</label>
              <input name="digitalFile" type="file" accept=".zip,.pdf,.rar,.7z" className="form-control" />
              {product?.fileName && (
                <div className="form-text"><i className="bi bi-file-earmark-check me-1" />File saat ini: {product.fileName} (kosongkan jika tidak ingin mengganti)</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="stat-card mb-3">
            <h2 className="h6 fw-bold mb-3">Publikasi</h2>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Status</label>
              <select name="status" defaultValue={product?.status ?? "DRAFT"} className="form-select">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" name="featured" id="featured" defaultChecked={product?.featured} />
              <label className="form-check-label small" htmlFor="featured">Jadikan produk unggulan</label>
            </div>
          </div>

          <div className="stat-card mb-3">
            <h2 className="h6 fw-bold mb-3">Harga & Kategori</h2>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Harga (Rp)</label>
              <input name="price" type="number" min={0} required defaultValue={product?.price ?? 0} className="form-control" />
            </div>
            <div className="mb-0">
              <label className="form-label small fw-semibold">Kategori</label>
              <select name="categoryId" defaultValue={product?.categoryId ?? ""} className="form-select">
                <option value="">— Tanpa kategori —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-flex gap-2">
            <SaveBtn />
            <Link href="/admin/produk" className="btn btn-outline-ink">Batal</Link>
          </div>
        </div>
      </div>
    </form>
  );
}
