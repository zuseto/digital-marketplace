"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const safeImages = images.length ? images : ["https://picsum.photos/seed/placeholder/900/600"];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="card-elevated overflow-hidden mb-3">
        <div className="ratio ratio-16x9" style={{ background: "var(--surface-2)" }}>
          <Image
            src={safeImages[active]}
            alt={alt}
            width={900}
            height={600}
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </div>
      {safeImages.length > 1 && (
        <div className="d-flex gap-2 flex-wrap">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="p-0 border-0 rounded overflow-hidden"
              style={{
                width: 84,
                height: 64,
                outline: active === i ? "3px solid var(--brand-600)" : "1px solid var(--line)",
              }}
              aria-label={`Lihat gambar ${i + 1}`}
            >
              <Image src={img} alt={`${alt} ${i + 1}`} width={84} height={64} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
