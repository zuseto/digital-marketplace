import "server-only";
import { randomBytes } from "crypto";

export function generateInvoice(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = randomBytes(3).toString("hex").toUpperCase();
  return `INV-${y}${m}${d}-${rand}`;
}

export function generateToken(bytes = 24): string {
  return randomBytes(bytes).toString("hex");
}
