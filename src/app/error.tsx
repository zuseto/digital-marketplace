"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center min-vh-100 p-4">
      <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: "3.5rem" }} />
      <h1 className="h4 fw-bold mt-3">Terjadi kesalahan</h1>
      <p className="text-muted-2" style={{ maxWidth: 420 }}>
        Maaf, sesuatu tidak berjalan semestinya. Silakan coba lagi.
      </p>
      <button onClick={reset} className="btn btn-brand mt-2">
        <i className="bi bi-arrow-clockwise me-1" />Coba Lagi
      </button>
    </div>
  );
}
