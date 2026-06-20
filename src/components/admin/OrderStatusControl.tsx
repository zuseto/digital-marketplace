"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/app/admin/order-actions";
import { useToast } from "@/components/ToastProvider";

const OPTIONS = ["PENDING", "PAID", "FAILED", "EXPIRED"];

export default function OrderStatusControl({ id, status }: { id: string; status: string }) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [current, setCurrent] = useState(status);

  async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setBusy(true);
    try {
      await updateOrderStatus(id, next);
      setCurrent(next);
      toast(`Status diubah ke ${next}`, "success");
    } catch {
      toast("Gagal mengubah status", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <select
      className={`form-select form-select-sm status-badge status-${current} border-0`}
      style={{ width: 120 }}
      value={current}
      onChange={onChange}
      disabled={busy}
    >
      {OPTIONS.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}
