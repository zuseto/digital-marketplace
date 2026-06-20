import Link from "next/link";

export default function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center min-vh-100 p-4">
      <div className="text-gradient fw-bold" style={{ fontSize: "5rem", lineHeight: 1 }}>404</div>
      <h1 className="h4 fw-bold mt-2">Halaman tidak ditemukan</h1>
      <p className="text-muted-2" style={{ maxWidth: 420 }}>
        Maaf, halaman atau produk yang kamu cari tidak tersedia atau sudah dipindahkan.
      </p>
      <div className="d-flex gap-2 mt-2">
        <Link href="/" className="btn btn-brand"><i className="bi bi-house me-1" />Beranda</Link>
        <Link href="/produk" className="btn btn-outline-ink">Lihat Produk</Link>
      </div>
    </div>
  );
}
