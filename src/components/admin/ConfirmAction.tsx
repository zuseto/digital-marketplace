"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastProvider";

export default function ConfirmAction({
  action,
  id,
  confirmText,
  successText,
  className = "btn btn-sm btn-outline-danger",
  icon = "bi-trash",
  label,
}: {
  action: (id: string) => Promise<void>;
  id: string;
  confirmText: string;
  successText: string;
  className?: string;
  icon?: string;
  label?: string;
}) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    if (!confirm(confirmText)) return;
    setBusy(true);
    try {
      await action(id);
      toast(successText, "success");
    } catch {
      toast("Aksi gagal", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button className={className} onClick={onClick} disabled={busy} title={label}>
      <i className={`bi ${icon}`} />
      {label && <span className="ms-1">{label}</span>}
    </button>
  );
}
