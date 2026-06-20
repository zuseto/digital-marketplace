"use client";

import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    // Memuat JS Bootstrap (dropdown, collapse, accordion) di sisi klien.
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return null;
}
