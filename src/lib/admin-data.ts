import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [totalProducts, paidOrders, pendingOrders, revenueAgg] = await Promise.all([
    prisma.product.count(),
    prisma.order.count({ where: { paymentStatus: "PAID" } }),
    prisma.order.count({ where: { paymentStatus: "PENDING" } }),
    prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { amount: true } }),
  ]);

  return {
    totalProducts,
    paidOrders,
    pendingOrders,
    totalRevenue: revenueAgg._sum.amount ?? 0,
  };
}

export async function getBestSellers(limit = 5) {
  const grouped = await prisma.order.groupBy({
    by: ["productId"],
    where: { paymentStatus: "PAID" },
    _count: { productId: true },
    _sum: { amount: true },
    orderBy: { _count: { productId: "desc" } },
    take: limit,
  });
  if (grouped.length === 0) return [];

  const products = await prisma.product.findMany({
    where: { id: { in: grouped.map((g) => g.productId) } },
    select: { id: true, name: true, thumbnail: true, price: true },
  });
  const map = new Map(products.map((p) => [p.id, p]));

  return grouped.map((g) => ({
    product: map.get(g.productId),
    sold: g._count.productId,
    revenue: g._sum.amount ?? 0,
  }));
}

export async function getRecentOrders(limit = 6) {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { product: { select: { name: true } } },
  });
}

// Pendapatan harian 14 hari terakhir untuk grafik.
export async function getRevenueSeries(days = 14) {
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: { paymentStatus: "PAID", createdAt: { gte: since } },
    select: { amount: true, createdAt: true },
  });

  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const o of orders) {
    const key = o.createdAt.toISOString().slice(0, 10);
    buckets.set(key, (buckets.get(key) ?? 0) + o.amount);
  }

  return Array.from(buckets.entries()).map(([date, total]) => ({
    label: date.slice(5),
    total,
  }));
}

export interface OrderFilter {
  search?: string;
  status?: string;
}

export async function getOrders(filter: OrderFilter = {}) {
  return prisma.order.findMany({
    where: {
      ...(filter.status ? { paymentStatus: filter.status as "PENDING" | "PAID" | "FAILED" | "EXPIRED" } : {}),
      ...(filter.search
        ? {
            OR: [
              { invoice: { contains: filter.search, mode: "insensitive" } },
              { customerName: { contains: filter.search, mode: "insensitive" } },
              { email: { contains: filter.search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true } } },
    take: 100,
  });
}

export async function getAdminProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true } } },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export async function getAdminCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function getAdminCoupons() {
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
}
