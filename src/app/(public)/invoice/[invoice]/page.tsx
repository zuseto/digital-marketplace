import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getOrderByInvoice } from "@/lib/data";
import { formatRupiah, formatDate } from "@/lib/utils";
import InvoiceStatus from "@/components/InvoiceStatus";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Invoice", robots: { index: false } };

type Params = Promise<{ invoice: string }>;

export default async function InvoicePage({ params }: { params: Params }) {
  const { invoice } = await params;
  const order = await getOrderByInvoice(invoice);
  if (!order) notFound();

  return (
    <div className="section-sm">
      <div className="container container-tight" style={{ maxWidth: 720 }}>
        <div className="card-elevated p-4 p-lg-5">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
            <div>
              <span className="eyebrow">Invoice</span>
              <h1 className="h4 fw-bold mb-0">{order.invoice}</h1>
              <div className="small text-muted-2">{formatDate(order.createdAt)}</div>
            </div>
            <span className={`status-badge status-${order.paymentStatus}`}>{order.paymentStatus}</span>
          </div>

          <InvoiceStatus
            invoice={order.invoice}
            initialStatus={order.paymentStatus}
            initialToken={order.download?.token ?? null}
            fileName={order.product.fileName}
          />

          <hr className="my-4" />

          <div className="d-flex gap-3 mb-4">
            <Image
              src={order.product.thumbnail || "https://picsum.photos/seed/inv/160/120"}
              alt={order.product.name}
              width={96}
              height={72}
              className="rounded"
              style={{ objectFit: "cover" }}
            />
            <div>
              <div className="fw-semibold">{order.product.name}</div>
              <div className="small text-muted-2">Produk Digital</div>
            </div>
          </div>

          <div className="rounded p-3 mb-4" style={{ background: "var(--surface-2)" }}>
            <Row label="Subtotal" value={formatRupiah(order.amount + order.discount)} />
            {order.discount > 0 && (
              <Row
                label={`Diskon${order.couponCode ? ` (${order.couponCode})` : ""}`}
                value={`- ${formatRupiah(order.discount)}`}
                accent
              />
            )}
            <hr className="my-2" />
            <Row label="Total" value={formatRupiah(order.amount)} bold />
          </div>

          <div className="small text-muted-2">
            <div className="fw-semibold text-ink mb-1">Detail Pembeli</div>
            <div>{order.customerName}</div>
            <div>{order.email}</div>
            <div>{order.phone}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className="d-flex justify-content-between py-1">
      <span className={accent ? "text-success" : "text-muted-2"}>{label}</span>
      <span className={`${bold ? "fw-bold fs-5 text-ink" : ""} ${accent ? "text-success" : ""}`}>{value}</span>
    </div>
  );
}
