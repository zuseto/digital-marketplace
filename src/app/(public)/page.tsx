import Link from "next/link";
import { getFeaturedProducts, getCategories } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

const CATEGORY_ICONS: Record<string, string> = {
  "template-website": "bi-window-stack",
  "template-blogger": "bi-journal-richtext",
  "source-code": "bi-code-slash",
  ebook: "bi-book",
  "desain-digital": "bi-palette",
  "asset-premium": "bi-gem",
  "prompt-ai": "bi-robot",
};

const FEATURES = [
  { icon: "bi-lightning-charge", title: "Download Instan", text: "Begitu pembayaran terkonfirmasi, link download langsung aktif otomatis." },
  { icon: "bi-shield-check", title: "Pembayaran Aman", text: "Transaksi diproses lewat payment gateway tepercaya dengan enkripsi penuh." },
  { icon: "bi-patch-check", title: "Produk Berkualitas", text: "Setiap produk dikurasi agar kamu mendapat aset digital terbaik." },
  { icon: "bi-arrow-repeat", title: "Update Seumur Hidup", text: "Dapatkan pembaruan produk tanpa biaya tambahan selamanya." },
  { icon: "bi-headset", title: "Dukungan Responsif", text: "Tim kami siap membantu via email & WhatsApp kapan pun." },
  { icon: "bi-receipt", title: "Invoice Otomatis", text: "Setiap pembelian dilengkapi invoice rapi yang bisa diunduh." },
];

const TESTIMONIALS = [
  { name: "Rizki Pratama", role: "Web Developer", text: "Source code-nya rapi banget, hemat waktu development saya berminggu-minggu. Worth it!", avatar: "R" },
  { name: "Sarah Amelia", role: "Content Creator", text: "Beli template, langsung dapat link download. Prosesnya cepat dan profesional.", avatar: "S" },
  { name: "Dimas Nugroho", role: "Startup Founder", text: "Kualitas asetnya premium dan harganya masuk akal. Pasti balik lagi.", avatar: "D" },
];

const FAQS = [
  { q: "Bagaimana cara membeli produk?", a: "Pilih produk, klik beli, isi data (nama, email, WhatsApp), lalu lakukan pembayaran. Setelah terkonfirmasi, link download otomatis muncul." },
  { q: "Apakah perlu membuat akun?", a: "Tidak. Pembelian bisa dilakukan tanpa registrasi. Link download dan invoice dikirim berdasarkan email yang kamu masukkan." },
  { q: "Metode pembayaran apa saja yang didukung?", a: "Kami menggunakan payment gateway yang mendukung QRIS, transfer bank (virtual account), e-wallet, hingga kartu kredit." },
  { q: "Berapa lama link download berlaku?", a: "Link download aman berbasis token dan berlaku selama beberapa hari setelah pembayaran sukses. Kamu bisa mengunduh ulang dalam periode tersebut." },
  { q: "Apakah produk bisa digunakan untuk komersial?", a: "Mayoritas produk dilengkapi lisensi komersial. Detail lisensi tercantum pada masing-masing halaman produk." },
];

export default async function HomePage() {
  const [featured, categories] = await Promise.all([getFeaturedProducts(6), getCategories()]);

  const displayCategories: { slug: string; name: string; count: number | null }[] =
    categories.length
      ? categories.map((c) => ({ slug: c.slug, name: c.name, count: c._count.products }))
      : FALLBACK_CATEGORIES.map((c) => ({ slug: c.slug, name: c.name, count: null }));

  return (
    <>
      {/* HERO */}
      <section className="hero section position-relative">
        <div className="hero-glow" style={{ background: "var(--brand-500)", top: -120, left: -80 }} />
        <div className="hero-glow" style={{ background: "var(--accent)", bottom: -160, right: -60 }} />
        <div className="container container-tight position-relative">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <Reveal>
                <span className="chip mb-3"><i className="bi bi-stars text-warning" /> Marketplace Produk Digital #1</span>
                <h1 className="hero-title mb-3">
                  Jual & beli <span className="text-gradient">produk digital</span> premium dengan mudah
                </h1>
                <p className="fs-5 text-muted-2 mb-4" style={{ maxWidth: 520 }}>
                  Template website, source code, ebook, asset, hingga prompt AI. Bayar otomatis,
                  download instan — tanpa ribet.
                </p>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  <Link href="/produk" className="btn btn-brand btn-lg">
                    <i className="bi bi-grid me-2" />Jelajahi Produk
                  </Link>
                  <Link href="/#keunggulan" className="btn btn-outline-ink btn-lg">
                    Pelajari Lebih Lanjut
                  </Link>
                </div>
                <div className="d-flex gap-4">
                  <div><div className="stat-num">500+</div><div className="small text-muted-2">Produk Digital</div></div>
                  <div><div className="stat-num">12K+</div><div className="small text-muted-2">Pelanggan Puas</div></div>
                  <div><div className="stat-num">4.9★</div><div className="small text-muted-2">Rating Rata-rata</div></div>
                </div>
              </Reveal>
            </div>
            <div className="col-lg-6">
              <Reveal delay={120}>
                <div className="position-relative">
                  <div className="card-elevated p-3" style={{ transform: "rotate(-2deg)" }}>
                    <div className="ratio ratio-16x9 rounded overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="https://picsum.photos/seed/herodash/900/520" alt="Preview produk digital" style={{ objectFit: "cover" }} />
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3 px-1">
                      <div>
                        <div className="fw-bold">Premium UI Kit</div>
                        <div className="small text-muted-2">Asset Premium</div>
                      </div>
                      <span className="price-tag">Rp149.000</span>
                    </div>
                  </div>
                  <div className="card-elevated p-3 position-absolute d-none d-md-block"
                    style={{ bottom: -28, left: -24, width: 220, transform: "rotate(3deg)" }}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="feature-icon" style={{ width: 40, height: 40, fontSize: "1rem" }}>
                        <i className="bi bi-check-lg" />
                      </span>
                      <div>
                        <div className="fw-semibold small">Pembayaran sukses</div>
                        <div className="text-muted-2" style={{ fontSize: ".75rem" }}>Download siap diunduh</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUK UNGGULAN */}
      <section className="section" id="unggulan">
        <div className="container container-tight">
          <Reveal>
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
              <div>
                <span className="eyebrow">Pilihan Terbaik</span>
                <h2 className="h1 mt-1 mb-0">Produk Unggulan</h2>
              </div>
              <Link href="/produk" className="btn btn-ghost fw-semibold">
                Lihat semua <i className="bi bi-arrow-right ms-1" />
              </Link>
            </div>
          </Reveal>

          {featured.length === 0 ? (
            <EmptyHint />
          ) : (
            <div className="row g-4">
              {featured.map((p, i) => (
                <div className="col-sm-6 col-lg-4" key={p.slug}>
                  <Reveal delay={i * 60}><ProductCard product={p} /></Reveal>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* KATEGORI */}
      <section className="section-sm" id="kategori" style={{ background: "var(--surface-2)" }}>
        <div className="container container-tight">
          <Reveal>
            <div className="text-center mb-4">
              <span className="eyebrow">Jelajahi</span>
              <h2 className="h1 mt-1">Kategori Produk</h2>
            </div>
          </Reveal>
          <div className="row g-3">
            {displayCategories.map((c, i) => (
              <div className="col-6 col-md-4 col-lg-3" key={c.slug}>
                <Reveal delay={i * 40}>
                  <Link href={`/produk?kategori=${c.slug}`} className="card-elevated p-4 d-block h-100 text-center">
                    <div className="feature-icon mx-auto mb-3">
                      <i className={`bi ${CATEGORY_ICONS[c.slug] || "bi-box"}`} />
                    </div>
                    <div className="fw-bold text-ink">{c.name}</div>
                    <div className="small text-muted-2">
                      {c.count !== null ? `${c.count} produk` : "Jelajahi"}
                    </div>
                  </Link>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEUNGGULAN */}
      <section className="section" id="keunggulan">
        <div className="container container-tight">
          <Reveal>
            <div className="text-center mb-5">
              <span className="eyebrow">Kenapa Kami</span>
              <h2 className="h1 mt-1">Dibuat untuk pengalaman terbaik</h2>
              <p className="text-muted-2 mx-auto" style={{ maxWidth: 560 }}>
                Semua yang kamu butuhkan untuk membeli produk digital dengan aman, cepat, dan nyaman.
              </p>
            </div>
          </Reveal>
          <div className="row g-4">
            {FEATURES.map((f, i) => (
              <div className="col-md-6 col-lg-4" key={f.title}>
                <Reveal delay={i * 50}>
                  <div className="card-elevated p-4 h-100">
                    <div className="feature-icon mb-3"><i className={`bi ${f.icon}`} /></div>
                    <h3 className="h5 fw-bold">{f.title}</h3>
                    <p className="text-muted-2 mb-0">{f.text}</p>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONI */}
      <section className="section-sm" id="testimoni" style={{ background: "var(--surface-2)" }}>
        <div className="container container-tight">
          <Reveal>
            <div className="text-center mb-5">
              <span className="eyebrow">Testimoni</span>
              <h2 className="h1 mt-1">Dipercaya ribuan pelanggan</h2>
            </div>
          </Reveal>
          <div className="row g-4">
            {TESTIMONIALS.map((t, i) => (
              <div className="col-md-4" key={t.name}>
                <Reveal delay={i * 70}>
                  <div className="card-elevated p-4 h-100">
                    <div className="text-warning mb-3">
                      {Array.from({ length: 5 }).map((_, s) => <i key={s} className="bi bi-star-fill me-1" />)}
                    </div>
                    <p className="mb-4">“{t.text}”</p>
                    <div className="d-flex align-items-center gap-3">
                      <span className="feature-icon" style={{ width: 44, height: 44 }}>{t.avatar}</span>
                      <div>
                        <div className="fw-bold text-ink">{t.name}</div>
                        <div className="small text-muted-2">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="container container-tight" style={{ maxWidth: 820 }}>
          <Reveal>
            <div className="text-center mb-5">
              <span className="eyebrow">FAQ</span>
              <h2 className="h1 mt-1">Pertanyaan yang sering diajukan</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="accordion" id="faqAccordion">
              {FAQS.map((f, i) => (
                <div className="accordion-item" key={i}>
                  <h3 className="accordion-header">
                    <button
                      className={`accordion-button ${i !== 0 ? "collapsed" : ""} fw-semibold`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#faq${i}`}
                    >
                      {f.q}
                    </button>
                  </h3>
                  <div id={`faq${i}`} className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`} data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-muted-2">{f.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm">
        <div className="container container-tight">
          <Reveal>
            <div className="card-elevated p-5 text-center position-relative overflow-hidden"
              style={{ background: "linear-gradient(120deg, var(--brand-600), var(--brand-700))" }}>
              <div className="hero-glow" style={{ background: "var(--accent)", top: -100, right: -40, opacity: .4 }} />
              <h2 className="text-white mb-2 position-relative">Siap menemukan produk digital impianmu?</h2>
              <p className="text-white-50 mb-4 position-relative">Ribuan aset premium menunggu. Mulai jelajahi sekarang.</p>
              <Link href="/produk" className="btn btn-light btn-lg fw-bold position-relative">
                <i className="bi bi-bag-heart me-2" />Mulai Belanja
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

const FALLBACK_CATEGORIES = [
  { slug: "template-website", name: "Template Website" },
  { slug: "source-code", name: "Source Code" },
  { slug: "ebook", name: "Ebook" },
  { slug: "prompt-ai", name: "Prompt AI" },
];

function EmptyHint() {
  return (
    <div className="card-elevated p-5 text-center">
      <i className="bi bi-database-x fs-1 text-muted-2 mb-2 d-block" />
      <h3 className="h5">Belum ada produk</h3>
      <p className="text-muted-2 mb-0">
        Jalankan migrasi & seed database (<code>npm run db:migrate</code> lalu <code>npm run db:seed</code>),
        atau tambahkan produk dari dashboard admin.
      </p>
    </div>
  );
}
