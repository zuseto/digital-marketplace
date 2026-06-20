import { put, del } from "@vercel/blob";

export async function uploadFile(
  file: File,
  prefix: string
): Promise<{ url: string; name: string; size: number }> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const blob = await put(`${prefix}/${Date.now()}-${safeName}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return { url: blob.url, name: file.name, size: file.size };
}

export async function deleteFile(url: string): Promise<void> {
  try {
    await del(url);
  } catch {
    // abaikan jika file sudah tidak ada
  }
}
