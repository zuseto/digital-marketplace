import { PrismaClient, ProductStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { name: "Template Website", slug: "template-website" },
  { name: "Template Blogger", slug: "template-blogger" },
  { name: "Source Code", slug: "source-code" },
  { name: "Ebook", slug: "ebook" },
  { name: "Desain Digital", slug: "desain-digital" },
  { name: "Asset Premium", slug: "asset-premium" },
  { name: "Prompt AI", slug: "prompt-ai" },
];

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  features: string[];
  price: number;
  thumbnail: string;
  categorySlug: string;
  featured: boolean;
};

const products: SeedProduct[] = [
  {
    name: "Nova — Template SaaS Landing Page",
    slug: "nova-template-saas-landing-page",
    description:
      "Template landing page modern untuk produk SaaS. Dibangun responsif dengan animasi halus, siap pakai, dan mudah dikustomisasi. Cocok untuk startup, agensi, maupun produk digital.",
    features: [
      "Desain modern & fully responsive",
      "10+ section siap pakai",
      "Animasi on-scroll halus",
      "Kode bersih & terdokumentasi",
      "Gratis update seumur hidup",
    ],
    price: 149000,
    thumbnail: "https://picsum.photos/seed/nova/800/600",
    categorySlug: "template-website",
    featured: true,
  },
  {
    name: "Aurora — Premium Blogger Template",
    slug: "aurora-premium-blogger-template",
    description:
      "Template Blogger premium dengan fokus kecepatan dan SEO. Skor PageSpeed tinggi, mendukung AMP, dan tata letak elegan untuk blog profesional.",
    features: ["SEO friendly", "Fast loading", "Dark mode", "Responsive", "Mudah diatur"],
    price: 99000,
    thumbnail: "https://picsum.photos/seed/aurora/800/600",
    categorySlug: "template-blogger",
    featured: true,
  },
  {
    name: "Commerce Kit — Next.js E-commerce Starter",
    slug: "commerce-kit-nextjs-ecommerce-starter",
    description:
      "Source code starter e-commerce lengkap dengan keranjang, checkout, dan integrasi pembayaran. Hemat berminggu-minggu pengembangan.",
    features: [
      "Next.js + TypeScript",
      "Integrasi payment gateway",
      "Admin dashboard",
      "Database schema siap pakai",
      "Dokumentasi lengkap",
    ],
    price: 299000,
    thumbnail: "https://picsum.photos/seed/commerce/800/600",
    categorySlug: "source-code",
    featured: true,
  },
  {
    name: "Mastering Digital Selling — Ebook",
    slug: "mastering-digital-selling-ebook",
    description:
      "Panduan lengkap 120 halaman cara menjual produk digital dari nol hingga cuan konsisten. Berisi strategi marketing, pricing, dan funnel penjualan.",
    features: ["120 halaman PDF", "Studi kasus nyata", "Checklist actionable", "Bonus template"],
    price: 79000,
    thumbnail: "https://picsum.photos/seed/ebook/800/600",
    categorySlug: "ebook",
    featured: false,
  },
  {
    name: "Lumen — 500 Premium UI Icons",
    slug: "lumen-500-premium-ui-icons",
    description:
      "Koleksi 500 ikon UI premium dalam format SVG. Konsisten, scalable, dan cocok untuk web maupun aplikasi mobile.",
    features: ["500 ikon SVG", "3 style berbeda", "Mudah diwarnai", "Lisensi komersial"],
    price: 59000,
    thumbnail: "https://picsum.photos/seed/lumen/800/600",
    categorySlug: "asset-premium",
    featured: false,
  },
  {
    name: "Pro Prompt Pack — 300 AI Prompts",
    slug: "pro-prompt-pack-300-ai-prompts",
    description:
      "Kumpulan 300 prompt AI siap pakai untuk copywriting, coding, desain, dan produktivitas. Tingkatkan hasil ChatGPT & Claude secara instan.",
    features: ["300 prompt teruji", "7 kategori", "Update berkala", "Format mudah disalin"],
    price: 49000,
    thumbnail: "https://picsum.photos/seed/prompt/800/600",
    categorySlug: "prompt-ai",
    featured: true,
  },
  {
    name: "Gradient Mesh — 80 Background Pack",
    slug: "gradient-mesh-80-background-pack",
    description:
      "80 background gradient mesh resolusi tinggi untuk presentasi, sosial media, dan desain web. Format PNG & SVG.",
    features: ["80 background HD", "PNG + SVG", "Resolusi 4K", "Lisensi komersial"],
    price: 39000,
    thumbnail: "https://picsum.photos/seed/gradient/800/600",
    categorySlug: "desain-digital",
    featured: false,
  },
  {
    name: "Portfolio Pro — Personal Website Template",
    slug: "portfolio-pro-personal-website-template",
    description:
      "Template website portofolio personal yang elegan untuk desainer, developer, dan freelancer. Tampil profesional dalam hitungan menit.",
    features: ["Responsif", "Dark/Light mode", "Form kontak", "Animasi halus", "SEO ready"],
    price: 89000,
    thumbnail: "https://picsum.photos/seed/portfolio/800/600",
    categorySlug: "template-website",
    featured: false,
  },
];

async function main() {
  console.log("🌱 Seeding...");

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@marketplace.test";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin12345";
  const hashed = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, password: hashed, name: "Administrator", role: "ADMIN" },
  });
  console.log(`✅ Admin: ${adminEmail}`);

  const categoryMap = new Map<string, string>();
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
    categoryMap.set(c.slug, cat.id);
  }
  console.log(`✅ ${categories.length} kategori`);

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        features: p.features,
        price: p.price,
        thumbnail: p.thumbnail,
        gallery: [p.thumbnail],
        status: ProductStatus.PUBLISHED,
        featured: p.featured,
        fileUrl: "https://example.com/sample-file.zip",
        fileName: "sample-file.zip",
        fileSize: 1024 * 1024 * 5,
        categoryId: categoryMap.get(p.categorySlug),
      },
    });
  }
  console.log(`✅ ${products.length} produk`);

  await prisma.coupon.upsert({
    where: { code: "HEMAT10" },
    update: {},
    create: { code: "HEMAT10", type: "PERCENT", value: 10, active: true },
  });
  console.log("✅ Kupon contoh: HEMAT10");

  console.log("🎉 Seed selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
