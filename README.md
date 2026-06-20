# Digital Product Marketplace

Marketplace produk digital premium yang production-ready — jual template, source code,
ebook, asset, dan prompt AI dengan pembayaran otomatis (Midtrans) dan download instan.

Dibangun dengan **Next.js 15 (App Router) · TypeScript · Bootstrap 5 · Prisma · PostgreSQL · Auth.js · Midtrans · Vercel Blob**.

---

## ✨ Fitur

**Storefront**
- Homepage premium (hero, produk unggulan, kategori, keunggulan, testimoni, FAQ, CTA)
- Katalog produk: pencarian, filter kategori, sorting harga, badge
- Halaman detail: galeri, deskripsi, fitur, produk terkait, view counter
- Checkout tanpa akun (nama, email, WhatsApp) + kupon diskon
- Pembayaran Midtrans Snap + verifikasi webhook otomatis
- Invoice real-time + tombol download aman berbasis token (URL file tidak ter-expose)
- SEO: metadata dinamis, Open Graph, JSON-LD, sitemap, robots.txt

**Admin (`/admin`)**
- Login aman (Auth.js, khusus ADMIN) + proteksi route via middleware
- Dashboard: total pendapatan, transaksi, produk, grafik pendapatan, produk terlaris
- CRUD produk + upload thumbnail & file digital ke Vercel Blob
- Manajemen transaksi: pencarian, filter status, ubah status manual
- Manajemen kategori & kupon diskon

---

## 🚀 Menjalankan Secara Lokal

### 1. Prasyarat
- Node.js 18.18+ (disarankan 20/22)
- Akun gratis: [Neon](https://neon.tech) (database), [Midtrans Sandbox](https://dashboard.sandbox.midtrans.com), [Vercel](https://vercel.com) (Blob)

### 2. Install dependency
```bash
npm install
```

### 3. Konfigurasi environment
Salin `.env.example` menjadi `.env` lalu isi nilainya:
```bash
cp .env.example .env
```

| Variabel | Cara mendapatkan |
|----------|------------------|
| `DATABASE_URL` / `DIRECT_URL` | Neon → Project → Connection string (pooled untuk DATABASE_URL, direct untuk DIRECT_URL) |
| `AUTH_SECRET` | Jalankan `openssl rand -base64 32` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Kredensial admin awal (dipakai saat seed) |
| `MIDTRANS_SERVER_KEY` / `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | Midtrans Sandbox → Settings → Access Keys |
| `BLOB_READ_WRITE_TOKEN` | Vercel → Storage → Blob → Tokens |

### 4. Migrasi & seed database
```bash
npm run db:migrate     # buat tabel
npm run db:seed        # isi kategori, produk contoh, akun admin, kupon HEMAT10
```

### 5. Jalankan
```bash
npm run dev
```
- Toko: http://localhost:3000
- Admin: http://localhost:3000/admin (login dengan ADMIN_EMAIL / ADMIN_PASSWORD)

---

## 💳 Menguji Pembayaran (Midtrans Sandbox)

1. Lakukan checkout sebuah produk.
2. Popup Snap muncul → pilih metode (mis. kartu kredit sandbox `4811 1111 1111 1114`, exp bebas, CVV bebas, OTP `112233`).
3. Untuk verifikasi otomatis, Midtrans perlu mengirim **webhook** ke aplikasi.
   - Lokal: gunakan tunneling (mis. `ngrok http 3000`) dan set **Payment Notification URL** di
     Midtrans → Settings → Configuration ke `https://<domain-ngrok>/api/midtrans/webhook`.
   - Produksi: set ke `https://<domain-vercel>/api/midtrans/webhook`.
4. Setelah pembayaran sukses, order otomatis menjadi `PAID` dan tombol download aktif.

> Alternatif tanpa webhook: admin bisa mengubah status order menjadi `PAID` manual dari `/admin/order`.

---

## ☁️ Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Vercel → **Add New Project** → import repo.
3. Tambahkan semua environment variable dari `.env` di **Project → Settings → Environment Variables**.
   Set `NEXT_PUBLIC_APP_URL` & `NEXTAUTH_URL` ke domain Vercel kamu.
4. Buat database: Vercel → **Storage → Postgres (Neon)**, lalu salin connection string ke `DATABASE_URL`/`DIRECT_URL`.
5. Buat **Blob store**: Vercel → **Storage → Blob**, salin token ke `BLOB_READ_WRITE_TOKEN`.
6. Deploy. Build otomatis menjalankan `prisma generate`.
7. Setelah deploy pertama, jalankan migrasi & seed dari mesin lokal yang menunjuk ke DB produksi:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```
8. Set **Payment Notification URL** Midtrans ke `https://<domain>/api/midtrans/webhook`.

---

## 📁 Struktur Folder

```
prisma/
  schema.prisma          # users, categories, products, orders, downloads, coupons
  seed.ts                # data awal
src/
  app/
    (public)/            # storefront: home, produk, detail, checkout, invoice
    admin/               # dashboard, produk, order, kategori, kupon, login + server actions
    api/
      checkout/          # buat order + Snap token
      midtrans/webhook/  # callback pembayaran (verifikasi signature)
      download/[token]/  # serve file via token aman
      order/[invoice]/   # polling status
      auth/[...nextauth]/
    sitemap.ts · robots.ts
  components/            # UI publik + admin
  lib/                   # prisma, auth, midtrans, blob, data, utils
  middleware.ts          # proteksi /admin
```

---

## 🔒 Catatan Keamanan
- Route `/admin/*` dilindungi middleware Auth.js.
- Password admin di-hash dengan bcrypt.
- Webhook Midtrans memverifikasi signature SHA-512 sebelum mengubah status.
- File digital di-serve melalui proxy token (`/api/download/[token]`) sehingga URL storage asli tidak ter-expose; token punya masa berlaku.
- Semua kredensial disimpan di environment variables (tidak di-commit).

---

## 📜 Skrip
| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Jalankan dev server |
| `npm run build` | Build produksi (otomatis `prisma generate`) |
| `npm run db:migrate` | Migrasi schema (dev) |
| `npm run db:seed` | Isi data contoh |
| `npm run db:studio` | Buka Prisma Studio |
