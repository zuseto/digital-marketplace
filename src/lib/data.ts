import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// Wrapper aman: jika DB belum terkoneksi (saat setup awal), kembalikan fallback
// agar halaman tetap render tanpa crash.
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("[data] query gagal:", (err as Error).message);
    return fallback;
  }
}

const productCardSelect = {
  slug: true,
  name: true,
  description: true,
  price: true,
  thumbnail: true,
  featured: true,
  category: { select: { name: true } },
} satisfies Prisma.ProductSelect;

export function getFeaturedProducts(limit = 6) {
  return safe(
    () =>
      prisma.product.findMany({
        where: { status: "PUBLISHED", featured: true },
        select: productCardSelect,
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    []
  );
}

export function getCategories() {
  return safe(
    () =>
      prisma.category.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { products: { where: { status: "PUBLISHED" } } } } },
      }),
    []
  );
}

export interface ProductFilter {
  search?: string;
  category?: string;
  sort?: "newest" | "price-asc" | "price-desc";
}

export function getProducts(filter: ProductFilter = {}) {
  const where: Prisma.ProductWhereInput = { status: "PUBLISHED" };
  if (filter.search) {
    where.OR = [
      { name: { contains: filter.search, mode: "insensitive" } },
      { description: { contains: filter.search, mode: "insensitive" } },
    ];
  }
  if (filter.category) where.category = { slug: filter.category };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filter.sort === "price-asc"
      ? { price: "asc" }
      : filter.sort === "price-desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  return safe(
    () => prisma.product.findMany({ where, select: productCardSelect, orderBy }),
    []
  );
}

export function getProductBySlug(slug: string) {
  return safe(
    () => prisma.product.findUnique({ where: { slug }, include: { category: true } }),
    null
  );
}

export function getRelatedProducts(categoryId: string | null, excludeSlug: string, limit = 3) {
  if (!categoryId) return Promise.resolve([]);
  return safe(
    () =>
      prisma.product.findMany({
        where: { status: "PUBLISHED", categoryId, slug: { not: excludeSlug } },
        select: productCardSelect,
        take: limit,
      }),
    []
  );
}

export function getOrderByInvoice(invoice: string) {
  return safe(
    () =>
      prisma.order.findUnique({
        where: { invoice },
        include: {
          product: { select: { name: true, thumbnail: true, fileName: true } },
          download: { select: { token: true, expiredAt: true } },
        },
      }),
    null
  );
}

export function incrementView(slug: string) {
  return safe(
    () => prisma.product.update({ where: { slug }, data: { views: { increment: 1 } } }),
    null
  );
}

export function getAllPublishedSlugs() {
  return safe(
    () => prisma.product.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    []
  );
}
