import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ token: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
  const { token } = await params;

  const download = await prisma.download.findUnique({
    where: { token },
    include: { order: { include: { product: true } } },
  });

  if (!download) {
    return NextResponse.json({ error: "Link download tidak valid" }, { status: 404 });
  }
  if (download.expiredAt < new Date()) {
    return NextResponse.json({ error: "Link download sudah kedaluwarsa" }, { status: 410 });
  }
  if (download.order.paymentStatus !== "PAID") {
    return NextResponse.json({ error: "Pembayaran belum lunas" }, { status: 403 });
  }

  const fileUrl = download.order.product.fileUrl;
  if (!fileUrl) {
    return NextResponse.json({ error: "File belum tersedia" }, { status: 404 });
  }

  // Proxy file dari storage agar URL asli tidak ter-expose ke klien.
  const upstream = await fetch(fileUrl);
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Gagal mengambil file" }, { status: 502 });
  }

  await prisma.download.update({
    where: { id: download.id },
    data: { count: { increment: 1 } },
  });

  const fileName = download.order.product.fileName ?? "produk-digital";
  const headers = new Headers();
  headers.set(
    "Content-Type",
    upstream.headers.get("content-type") ?? "application/octet-stream"
  );
  headers.set("Content-Disposition", `attachment; filename="${fileName}"`);
  const len = upstream.headers.get("content-length");
  if (len) headers.set("Content-Length", len);

  return new NextResponse(upstream.body, { status: 200, headers });
}
