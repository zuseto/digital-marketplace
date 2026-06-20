"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteProduct, toggleProductStatus } from "@/app/admin/product-actions";
import { useToast } from "@/components/ToastProvider";

export default function ProductActions({ id, status }: { id: string; status: string }) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  async function onToggle() {
    setBusy(true);
    try {
      await toggleProductStatus(id);
      toast(status === "PUBLISHED" ? "Produk disembunyikan" : "Produk dipublikasikan", "success");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!confirm("Hapus produk ini? Tindakan tidak bisa dibatalkan.")) return;
    setBusy(true);
    try {
      await deleteProduct(id);
      toast("Produk dihapus", "success");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="d-flex gap-1 justify-content-end">
      <Link href={`/admin/produk/${id}`} className="btn btn-sm btn-outline-ink" title="Edit">
        <i className="bi bi-pencil" />
      </Link>
      <button className="btn btn-sm btn-outline-ink" onClick={onToggle} disabled={busy} title="Publish/Unpublish">
        <i className={`bi ${status === "PUBLISHED" ? "bi-eye-slash" : "bi-eye"}`} />
      </button>
      <button className="btn btn-sm btn-outline-danger" onClick={onDelete} disabled={busy} title="Hapus">
        <i className="bi bi-trash" />
      </button>
    </div>
  );
}
