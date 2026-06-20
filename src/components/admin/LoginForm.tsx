"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "@/app/admin/auth-actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-brand btn-lg w-100" disabled={pending}>
      {pending ? <><span className="spinner-border spinner-border-sm me-2" />Memproses...</> : <>Masuk</>}
    </button>
  );
}

export default function LoginForm() {
  const [error, formAction] = useActionState(authenticate, undefined);

  return (
    <form action={formAction}>
      {error && (
        <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
          <i className="bi bi-exclamation-circle" />{error}
        </div>
      )}
      <div className="mb-3">
        <label className="form-label small fw-semibold">Email</label>
        <input name="email" type="email" required className="form-control form-control-lg" placeholder="admin@marketplace.test" />
      </div>
      <div className="mb-4">
        <label className="form-label small fw-semibold">Password</label>
        <input name="password" type="password" required className="form-control form-control-lg" placeholder="••••••••" />
      </div>
      <SubmitButton />
    </form>
  );
}
