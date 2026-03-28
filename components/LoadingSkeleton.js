"use client";

export default function LoadingSkeleton() {
  return (
    <div className="loading-skeleton">
      <div className="skel-header">
        <div className="skel-tabs">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton" style={{ width: 80, height: 32, borderRadius: 8 }} />
          ))}
        </div>
      </div>

      <div className="skel-content">
        <div className="skel-grid">
          <div className="skel-score">
            <div className="skeleton" style={{ width: 140, height: 140, borderRadius: "50%" }} />
            <div className="skeleton skeleton-text" style={{ width: 80 }} />
          </div>
          <div className="skel-stats">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: 70, borderRadius: 12 }} />
            ))}
          </div>
        </div>

        <div className="skel-cards">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skel-card">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" style={{ width: "70%" }} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .loading-skeleton {
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--glass-border);
          background: var(--dark-gray);
        }
        .skel-header {
          padding: 12px 16px;
          border-bottom: 1px solid var(--glass-border);
        }
        .skel-tabs {
          display: flex;
          gap: 8px;
        }
        .skel-content {
          padding: 20px;
        }
        .skel-grid {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }
        .skel-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 20px;
        }
        .skel-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .skel-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .skel-card {
          padding: 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--glass-border);
          background: var(--black-light);
        }
      `}</style>
    </div>
  );
}
