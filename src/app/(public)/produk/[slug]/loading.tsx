export default function Loading() {
  return (
    <div className="section-sm">
      <div className="container container-tight">
        <div className="skeleton mb-4" style={{ height: 16, width: 280 }} />
        <div className="row g-5">
          <div className="col-lg-7">
            <div className="skeleton rounded" style={{ aspectRatio: "16 / 9" }} />
            <div className="skeleton mt-4" style={{ height: 24, width: 200 }} />
            <div className="skeleton mt-3" style={{ height: 80 }} />
          </div>
          <div className="col-lg-5">
            <div className="card-elevated p-4">
              <div className="skeleton mb-2" style={{ height: 28, width: "80%" }} />
              <div className="skeleton mb-3" style={{ height: 16, width: "50%" }} />
              <div className="skeleton mb-3" style={{ height: 40, width: "60%" }} />
              <div className="skeleton rounded-pill" style={{ height: 48 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
