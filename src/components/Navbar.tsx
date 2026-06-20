"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/produk", label: "Produk" },
  { href: "/#kategori", label: "Kategori" },
  { href: "/#faq", label: "FAQ" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar navbar-expand-lg navbar-glass sticky-top py-2">
      <div className="container container-tight">
        <Link href="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold">
          <span className="brand-mark">D</span>
          <span className="text-ink">Digital<span className="text-gradient">Market</span></span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Buka menu"
        >
          <i className="bi bi-list fs-3" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav mx-auto gap-lg-1">
            {links.map((l) => (
              <li className="nav-item" key={l.href}>
                <Link
                  href={l.href}
                  className={`nav-link px-3 fw-medium ${pathname === l.href ? "text-dark fw-semibold" : ""}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="d-flex gap-2 mt-3 mt-lg-0">
            <Link href="/produk" className="btn btn-brand">
              <i className="bi bi-bag me-1" /> Belanja Sekarang
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
