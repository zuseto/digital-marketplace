"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/tokens";

const VALID = ["PENDING", "PAID", "FAILED", "EXPIRED"] as const;
type Status = (typeof VALID)[number];

export async function updateOrderStatus(id: string, status: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Tidak diizinkan");
  if (!VALID.includes(status as Status)) return;

  await prisma.order.update({ where: { id }, data: { paymentStatus: status as Status } });

  // Jika di-set PAID manual, buat token download.
  if (status === "PAID") {
    const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.download.upsert({
      where: { orderId: id },
      update: { expiredAt },
      create: { orderId: id, token: generateToken(24), expiredAt },
    });
  }

  revalidatePath("/admin/order");
  revalidatePath("/admin");
}
