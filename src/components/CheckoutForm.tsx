"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { useToast } from "@/components/ToastProvider";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        opts: {
          onSuccess?: () => void;
          onPending?: () => void;
          onError?: () => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export default function CheckoutForm({ productSlug, price }: { productSlug: string; price: number }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", couponCode: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, ...form }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast(data.error ?? "Gagal memproses checkout", "error");
        return;
      }

      if (data.snapToken && window.snap) {
        window.snap.pay(data.snapToken, {
          onSuccess: () => router.push(`/invoice/${data.invoice}`),
          onPending: () => router.push(`/invoice/${data.invoice}`),
          onError: () => toast("Pembayaran gagal. Coba lagi.", "error"),
          onClose: () => {
            toast("Pembayaran dibatalkan. Order tersimpan sebagai PENDING.", "info");
            router.push(`/invoice/${data.invoice}`);
          },
        });
      } else {
        // Midtrans belum dikonfigurasi — arahkan ke invoice.
        if (data.warning) toast(data.warning, "info");
        router.push(`/invoice/${data.invoice}`);
      }
    } catch {
      toast("Terjadi kesalahan jaringan", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label small fw-semibold">Nama Lengkap</label>
        <input className="form-control" required minLength={2} value={form.name} onChange={set("name")} placeholder="Nama kamu" />
      </div>
      <div className="mb-3">
        <label className="form-label small fw-semibold">Email</label>
        <input type="email" className="form-control" required value={form.email} onChange={set("email")} placeholder="email@contoh.com" />
        <div className="form-text">Invoice & link download dikirim ke email ini.</div>
      </div>
      <div className="mb-3">
        <label className="form-label small fw-semibold">Nomor WhatsApp</label>
        <input className="form-control" required value={form.phone} onChange={set("phone")} placeholder="0812xxxxxxxx" />
      </div>
      <div className="mb-4">
        <label className="form-label small fw-semibold">Kode Kupon <span className="text-muted-2 fw-normal">(opsional)</span></label>
        <input className="form-control text-uppercase" value={form.couponCode} onChange={set("couponCode")} placeholder="Contoh: HEMAT10" />
      </div>

      <button type="submit" className="btn btn-brand btn-lg w-100" disabled={loading}>
        {loading ? (
          <><span className="spinner-border spinner-border-sm me-2" />Memproses...</>
        ) : (
          <><i className="bi bi-shield-lock me-2" />Bayar Sekarang · {formatRupiah(price)}</>
        )}
      </button>
      <p className="text-center small text-muted-2 mt-3 mb-0">
        <i className="bi bi-lock-fill me-1" />Transaksi aman diproses oleh Midtrans
      </p>
    </form>
  );
}
