import midtransClient from "midtrans-client";
import { createHash } from "crypto";

const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";
const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

export const snap = new midtransClient.Snap({
  isProduction,
  serverKey,
  clientKey,
});

export interface SnapParams {
  invoice: string;
  amount: number;
  productName: string;
  customerName: string;
  email: string;
  phone: string;
}

export async function createSnapTransaction(params: SnapParams): Promise<{ token: string; redirectUrl: string }> {
  const result = await snap.createTransaction({
    transaction_details: {
      order_id: params.invoice,
      gross_amount: params.amount,
    },
    item_details: [
      {
        id: params.invoice,
        name: params.productName.slice(0, 50),
        price: params.amount,
        quantity: 1,
      },
    ],
    customer_details: {
      first_name: params.customerName,
      email: params.email,
      phone: params.phone,
    },
    credit_card: { secure: true },
  });
  return { token: result.token, redirectUrl: result.redirect_url };
}

// Verifikasi signature webhook Midtrans:
// SHA512(order_id + status_code + gross_amount + server_key)
export function verifySignature(payload: {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
}): boolean {
  const raw = payload.order_id + payload.status_code + payload.gross_amount + serverKey;
  const expected = createHash("sha512").update(raw).digest("hex");
  return expected === payload.signature_key;
}

export const MIDTRANS_SNAP_URL = isProduction
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";
