import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySignature } from "@/lib/midtrans";
import { generateToken } from "@/lib/tokens";
import type { PaymentStatus } from "@prisma/client";

function mapStatus(transactionStatus: string, fraudStatus?: string): PaymentStatus | null {
  switch (transactionStatus) {
    case "capture":
      return fraudStatus === "challenge" ? "PENDING" : "PAID";
    case "settlement":
      return "PAID";
    case "pending":
      return "PENDING";
    case "deny":
    case "cancel":
      return "FAILED";
    case "expire":
      return "EXPIRED";
    default:
      return null;
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const valid = verifySignature({
      order_id: payload.order_id,
      status_code: payload.status_code,
      gross_amount: payload.gross_amount,
      signature_key: payload.signature_key,
    });
    if (!valid) {
      return NextResponse.json({ error: "Signature tidak valid" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({ where: { invoice: payload.order_id } });
    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    const newStatus = mapStatus(payload.transaction_status, payload.fraud_status);
    if (!newStatus) {
      return NextResponse.json({ received: true });
    }

    // Idempoten: jika sudah PAID, jangan proses ulang.
    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ received: true, message: "Sudah diproses" });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: newStatus, paymentId: payload.transaction_id ?? null },
    });

    if (newStatus === "PAID") {
      // Buat token download (berlaku 7 hari).
      const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await prisma.download.upsert({
        where: { orderId: order.id },
        update: { expiredAt },
        create: { orderId: order.id, token: generateToken(24), expiredAt },
      });

      // Catat penggunaan kupon.
      if (order.couponCode) {
        await prisma.coupon.update({
          where: { code: order.couponCode },
          data: { usedCount: { increment: 1 } },
        }).catch(() => {});
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhook] error:", (err as Error).message);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
