import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ invoice: string }>;

// Endpoint ringan untuk polling status pembayaran dari halaman invoice.
export async function GET(_req: Request, { params }: { params: Params }) {
  const { invoice } = await params;
  const order = await prisma.order.findUnique({
    where: { invoice },
    include: { download: { select: { token: true } } },
  });
  if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });

  return NextResponse.json({
    status: order.paymentStatus,
    downloadToken: order.paymentStatus === "PAID" ? order.download?.token ?? null : null,
  });
}
