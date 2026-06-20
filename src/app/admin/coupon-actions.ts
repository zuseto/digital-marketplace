"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function ensureAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Tidak diizinkan");
}

export async function createCoupon(formData: FormData) {
  await ensureAdmin();
  const code = (formData.get("code") as string)?.trim().toUpperCase();
  const type = formData.get("type") === "FIXED" ? "FIXED" : "PERCENT";
  const value = Math.max(1, parseInt((formData.get("value") as string) || "0", 10));
  const maxUsesRaw = (formData.get("maxUses") as string)?.trim();
  const maxUses = maxUsesRaw ? parseInt(maxUsesRaw, 10) : null;
  if (!code) return;

  await prisma.coupon.upsert({
    where: { code },
    update: { type, value, maxUses, active: true },
    create: { code, type, value, maxUses, active: true },
  });
  revalidatePath("/admin/kupon");
}

export async function toggleCoupon(id: string) {
  await ensureAdmin();
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) return;
  await prisma.coupon.update({ where: { id }, data: { active: !coupon.active } });
  revalidatePath("/admin/kupon");
}

export async function deleteCoupon(id: string) {
  await ensureAdmin();
  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/kupon");
}
