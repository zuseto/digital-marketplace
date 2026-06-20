"use client";

import { useEffect, useState } from "react";

type Status = "PENDING" | "PAID" | "FAILED" | "EXPIRED";

export default function InvoiceStatus({
  invoice,
  initialStatus,
  initialToken,
  fileName,
}: {
  invoice: string;
  initialStatus: Status;
  initialToken: string | null;
  fileName: string | null;
}) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [token, setToken] = useState<string | null>(initialToken);

  useEffect(() => {
    if (status !== "PENDING") return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/order/${invoice}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.status !== "PENDING") {
          setStatus(data.status);
          setToken(data.downloadToken);
        }
      } catch {
        /* abaikan */
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [status, invoice]);

  if (status === "PAID") {
    return (
      <div className="text-center p-4 rounded" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "2.5rem" }} />
        <h2 className="h5 fw-bold mt-2 mb-1">Pembayaran Berhasil!</h2>
        <p className="text-muted-2 small mb-3">Terima kasih. Produkmu siap diunduh.</p>
        {token ? (
          <a href={`/api/download/${token}`} className="btn btn-brand btn-lg">
            <i className="bi bi-download me-2" />Download {fileName ? `(${fileName})` : "Sekarang"}
          </a>
        ) : (
          <p className="small text-muted-2">Menyiapkan file download...</p>
        )}
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div className="text-center p-4 rounded" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
        <div className="spinner-border text-warning mb-2" role="status" />
        <h2 className="h6 fw-bold mb-1">Menunggu Pembayaran</h2>
        <p className="text-muted-2 small mb-0">
          Selesaikan pembayaranmu. Status akan diperbarui otomatis di halaman ini.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center p-4 rounded" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
      <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: "2.5rem" }} />
      <h2 className="h6 fw-bold mt-2 mb-1">Pembayaran {status === "EXPIRED" ? "Kedaluwarsa" : "Gagal"}</h2>
      <p className="text-muted-2 small mb-0">Silakan ulangi proses pembelian.</p>
    </div>
  );
}
