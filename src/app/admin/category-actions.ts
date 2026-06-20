"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function ensureAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Tidak diizinkan");
}

export async function createCategory(formData: FormData) {
  await ensureAdmin();
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;
  const slug = slugify(name);
  await prisma.category.upsert({
    where: { slug },
    update: { name },
    create: { name, slug },
  });
  revalidatePath("/admin/kategori");
  revalidatePath("/produk");
}

export async function deleteCategory(id: string) {
  await ensureAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/kategori");
}
