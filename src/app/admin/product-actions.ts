"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile, deleteFile } from "@/lib/blob";
import { slugify } from "@/lib/utils";

async function ensureAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Tidak diizinkan");
}

function parseFeatures(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function saveProduct(formData: FormData) {
  await ensureAdmin();

  const id = (formData.get("id") as string) || null;
  const name = (formData.get("name") as string).trim();
  const slugInput = (formData.get("slug") as string)?.trim();
  const slug = slugInput ? slugify(slugInput) : slugify(name);
  const description = (formData.get("description") as string).trim();
  const price = Math.max(0, parseInt((formData.get("price") as string) || "0", 10));
  const categoryId = (formData.get("categoryId") as string) || null;
  const status = formData.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  const featured = formData.get("featured") === "on";
  const features = parseFeatures((formData.get("features") as string) || "");
  const thumbnailUrl = (formData.get("thumbnailUrl") as string)?.trim() || null;

  const thumbnailFile = formData.get("thumbnailFile") as File | null;
  const digitalFile = formData.get("digitalFile") as File | null;

  const existing = id ? await prisma.product.findUnique({ where: { id } }) : null;

  let thumbnail = existing?.thumbnail ?? thumbnailUrl;
  if (thumbnailFile && thumbnailFile.size > 0) {
    const up = await uploadFile(thumbnailFile, "thumbnails");
    thumbnail = up.url;
  } else if (thumbnailUrl) {
    thumbnail = thumbnailUrl;
  }

  let fileUrl = existing?.fileUrl ?? null;
  let fileName = existing?.fileName ?? null;
  let fileSize = existing?.fileSize ?? null;
  if (digitalFile && digitalFile.size > 0) {
    if (existing?.fileUrl) await deleteFile(existing.fileUrl);
    const up = await uploadFile(digitalFile, "products");
    fileUrl = up.url;
    fileName = up.name;
    fileSize = up.size;
  }

  const data = {
    name,
    slug,
    description,
    price,
    categoryId,
    status: status as "DRAFT" | "PUBLISHED",
    featured,
    features,
    thumbnail,
    gallery: thumbnail ? [thumbnail] : [],
    fileUrl,
    fileName,
    fileSize,
  };

  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    await prisma.product.create({ data });
  }

  revalidatePath("/admin/produk");
  revalidatePath("/produk");
  redirect("/admin/produk");
}

export async function deleteProduct(id: string) {
  await ensureAdmin();
  const product = await prisma.product.findUnique({ where: { id } });
  if (product?.fileUrl) await deleteFile(product.fileUrl);
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/produk");
  revalidatePath("/produk");
}

export async function toggleProductStatus(id: string) {
  await ensureAdmin();
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;
  await prisma.product.update({
    where: { id },
    data: { status: product.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" },
  });
  revalidatePath("/admin/produk");
  revalidatePath("/produk");
}
