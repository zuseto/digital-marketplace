"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

interface CategoryOption {
  slug: string;
  name: string;
}

export default function ProductFilters({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(params.get("q") ?? "");

  const activeCategory = params.get("kategori") ?? "";
  const activeSort = params.get("sort") ?? "newest";

  const update = useCallback(
    (next: Record<string, string | null>) => {
      const sp = new URLSearchParams(params.toString());
      Object.entries(next).forEach(([k, v]) => {
        if (v) sp.set(k, v);
        else sp.delete(k);
      });
      startTransition(() => router.push(`/produk?${sp.toString()}`, { scroll: false }));
    },
    [params, router]
  );

  return (
    <div className="mb-4">
      <form
        className="position-relative mb-3"
        onSubmit={(e) => {
          e.preventDefault();
          update({ q: search || null });
        }}
      >
        <i className="bi bi-search position-absolute text-muted-2" style={{ left: 18, top: "50%", transform: "translateY(-50%)" }} />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control form-control-lg ps-5 rounded-pill"
          placeholder="Cari template, source code, ebook..."
          style={{ borderColor: "var(--line)" }}
        />
        {isPending && (
          <span className="spinner-border spinner-border-sm text-primary position-absolute" style={{ right: 18, top: "50%", transform: "translateY(-50%)" }} />
        )}
      </form>

      <div className="d-flex flex-wrap justify-content-between gap-3 align-items-center">
        <div className="d-flex flex-wrap gap-2">
          <button className={`chip ${!activeCategory ? "active" : ""}`} onClick={() => update({ kategori: null })}>
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              className={`chip ${activeCategory === c.slug ? "active" : ""}`}
              onClick={() => update({ kategori: c.slug })}
            >
              {c.name}
            </button>
          ))}
        </div>

        <select
          className="form-select rounded-pill"
          style={{ maxWidth: 220, borderColor: "var(--line)" }}
          value={activeSort}
          onChange={(e) => update({ sort: e.target.value === "newest" ? null : e.target.value })}
        >
          <option value="newest">Terbaru</option>
          <option value="price-asc">Harga: Termurah</option>
          <option value="price-desc">Harga: Termahal</option>
        </select>
      </div>
    </div>
  );
}
