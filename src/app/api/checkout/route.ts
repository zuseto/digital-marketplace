import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSnapTransaction } from "@/lib/midtrans";
import { generateInvoice } from "@/lib/tokens";

const schema = z.object({
  productSlug: z.string().min(1),
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(8, "Nomor WhatsApp tidak valid"),
  couponCode: z.string().optional(),
});

function applyCoupon(
  price: number,
  coupon: { type: string; value: number } | null
): number {
  if (!coupon) return 0;
  const discount = coupon.type === "PERCENT" ? Math.round((price * coupon.value) / 100) : coupon.value;
  return Math.min(discount, price - 1000); // sisakan minimal Rp1.000
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
        { status: 400 }
      );
    }
    const { productSlug, name, email, phone, couponCode } = parsed.data;

    const product = await prisma.product.findUnique({ where: { slug: productSlug } });
    if (!product || product.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    // Validasi kupon (opsional)
    let discount = 0;
    let validCoupon: string | null = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      const isUsable =
        coupon &&
        coupon.active &&
        (!coupon.expiredAt || coupon.expiredAt > new Date()) &&
        (coupon.maxUses === null || coupon.usedCount < coupon.maxUses);
      if (!isUsable) {
        return NextResponse.json({ error: "Kupon tidak valid atau sudah kedaluwarsa" }, { status: 400 });
      }
      discount = applyCoupon(product.price, coupon);
      validCoupon = coupon.code;
    }

    const amount = product.price - discount;
    const invoice = generateInvoice();

    const order = await prisma.order.create({
      data: {
        invoice,
        customerName: name,
        email,
        phone,
        productId: product.id,
        amount,
        discount,
        couponCode: validCoupon,
        paymentStatus: "PENDING",
      },
    });

    let snapToken: string | null = null;
    let warning: string | undefined;
    try {
      const snap = await createSnapTransaction({
        invoice,
        amount,
        productName: product.name,
        customerName: name,
        email,
        phone,
      });
      snapToken = snap.token;
      await prisma.order.update({ where: { id: order.id }, data: { snapToken } });
    } catch (err) {
      // Midtrans belum dikonfigurasi / sandbox error — order tetap dibuat (PENDING).
      console.error("[checkout] Midtrans error:", (err as Error).message);
      warning = "Pembayaran belum dikonfigurasi. Order dibuat dengan status PENDING.";
    }

    return NextResponse.json({ invoice, snapToken, amount, discount, warning });
  } catch (err) {
    console.error("[checkout] error:", (err as Error).message);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
