import Link from "next/link";

export default function Footer() {
  const year = 2026;
  return (
    <footer className="footer pt-5 pb-4 mt-auto">
      <div className="container container-tight">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="brand-mark">D</span>
              <span className="fw-bold fs-5 text-white">DigitalMarket</span>
            </div>
            <p className="text-white-50 mb-3" style={{ maxWidth: 320 }}>
              Marketplace produk digital premium. Beli template, source code, ebook, asset, dan
              prompt AI — bayar otomatis, download instan.
            </p>
            <div className="d-flex gap-2">
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle" aria-label="Twitter">
                <i className="bi bi-twitter-x" />
              </a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle" aria-label="Instagram">
                <i className="bi bi-instagram" />
              </a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle" aria-label="GitHub">
                <i className="bi bi-github" />
              </a>
            </div>
          </div>
          <div className="col-6 col-lg-2">
            <h6 className="text-white mb-3">Produk</h6>
            <ul className="list-unstyled d-grid gap-2">
              <li><Link href="/produk">Semua Produk</Link></li>
              <li><Link href="/produk?kategori=template-website">Template Web</Link></li>
              <li><Link href="/produk?kategori=source-code">Source Code</Link></li>
              <li><Link href="/produk?kategori=ebook">Ebook</Link></li>
            </ul>
          </div>
          <div className="col-6 col-lg-2">
            <h6 className="text-white mb-3">Perusahaan</h6>
            <ul className="list-unstyled d-grid gap-2">
              <li><Link href="/#keunggulan">Keunggulan</Link></li>
              <li><Link href="/#testimoni">Testimoni</Link></li>
              <li><Link href="/#faq">FAQ</Link></li>
            </ul>
          </div>
          <div className="col-lg-4">
            <h6 className="text-white mb-3">Mulai jualan produk digitalmu</h6>
            <p className="text-white-50 small mb-3">
              Punya produk digital? Kelola katalog & transaksi lewat dashboard admin.
            </p>
            <Link href="/admin/login" className="btn btn-brand btn-sm">
              <i className="bi bi-shield-lock me-1" /> Masuk Admin
            </Link>
          </div>
        </div>
        <hr className="border-secondary my-4" />
        <div className="d-flex flex-column flex-md-row justify-content-between gap-2 small text-white-50">
          <span>© {year} DigitalMarket. Semua hak dilindungi.</span>
          <div className="d-flex gap-3">
            <a href="#">Kebijakan Privasi</a>
            <a href="#">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
