import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Login Admin", robots: { index: false } };

export default function AdminLoginPage() {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 p-3" style={{ background: "var(--ink-900)" }}>
      <div className="card-elevated p-4 p-lg-5 w-100" style={{ maxWidth: 420 }}>
        <div className="text-center mb-4">
          <span className="brand-mark mx-auto mb-3" style={{ width: 48, height: 48, fontSize: "1.3rem" }}>D</span>
          <h1 className="h4 fw-bold mb-1">Masuk Admin</h1>
          <p className="text-muted-2 small mb-0">Kelola produk, transaksi, dan pengaturan.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
