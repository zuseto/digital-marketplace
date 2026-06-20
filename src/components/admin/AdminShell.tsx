"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOutAction } from "@/app/admin/auth-actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "bi-speedometer2", exact: true },
  { href: "/admin/produk", label: "Produk", icon: "bi-box-seam" },
  { href: "/admin/order", label: "Transaksi", icon: "bi-receipt" },
  { href: "/admin/kategori", label: "Kategori", icon: "bi-tags" },
  { href: "/admin/kupon", label: "Kupon", icon: "bi-ticket-perforated" },
];

export default function AdminShell({ children, userEmail }: { children: React.ReactNode; userEmail: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <Link href="/admin" className="d-flex align-items-center gap-2 mb-4 text-white text-decoration-none px-2">
          <span className="brand-mark">D</span>
          <span className="fw-bold">DigitalMarket</span>
        </Link>
        <nav>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={isActive(n.href, n.exact) ? "active" : ""} onClick={() => setOpen(false)}>
              <i className={`bi ${n.icon}`} />
              {n.label}
            </Link>
          ))}
        </nav>
        <hr className="border-secondary" />
        <Link href="/" target="_blank">
          <i className="bi bi-box-arrow-up-right" />Lihat Toko
        </Link>
        <form action={signOutAction}>
          <button type="submit" className="btn w-100 text-start border-0 d-flex align-items-center gap-2 px-3 py-2 text-danger">
            <i className="bi bi-box-arrow-right" />Keluar
          </button>
        </form>
      </aside>

      <div className="admin-main">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-outline-ink btn-sm d-lg-none" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            <i className="bi bi-list" />
          </button>
          <div className="ms-auto d-flex align-items-center gap-2">
            <span className="feature-icon" style={{ width: 38, height: 38, fontSize: ".9rem" }}>
              {userEmail[0]?.toUpperCase()}
            </span>
            <span className="small text-muted-2 d-none d-sm-inline">{userEmail}</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
