export default function Loading() {
  return (
    <div className="section">
      <div className="container container-tight">
        <div className="skeleton mb-2" style={{ height: 38, width: 220 }} />
        <div className="skeleton mb-4" style={{ height: 18, width: 320 }} />
        <div className="skeleton mb-4 rounded-pill" style={{ height: 52 }} />
        <div className="row g-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="col-sm-6 col-lg-4 col-xl-3" key={i}>
              <div className="card-elevated p-0">
                <div className="skeleton" style={{ aspectRatio: "4 / 3" }} />
                <div className="p-3">
                  <div className="skeleton mb-2" style={{ height: 18, width: "80%" }} />
                  <div className="skeleton mb-3" style={{ height: 14, width: "60%" }} />
                  <div className="skeleton" style={{ height: 24, width: "40%" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
