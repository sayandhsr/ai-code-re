"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Calendar, Search, X, ChevronRight, Loader2 } from "lucide-react";
import { getUserHistory } from "@/lib/history";
import { useAuth } from "@/contexts/AuthContext";
import ResultsTabs from "@/components/ResultsTabs";

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadHistory() {
      if (!user) return;
      const data = await getUserHistory(user);
      setHistory(data);
      setLoading(false);
    }
    if (user) {
      loadHistory();
    }
  }, [user]);

  const filtered = history.filter((item) =>
    (item.language || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.code || "").toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown Date";
    // Firestore Timestamp to Date
    const d = timestamp.toDate ? timestamp.toDate() : new Date();
    return d.toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const getScoreColor = (s) => {
    if (s >= 86) return "var(--green)";
    if (s >= 70) return "var(--blue)";
    if (s >= 50) return "var(--yellow)";
    return "var(--red)";
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <div>
          <h1 className="page-title">
            <History size={22} color="var(--accent)" />
            Analysis History
          </h1>
          <p className="page-subtitle">
            {loading ? "Loading..." : `${history.length} saved analyses`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state-full">
          <Loader2 size={48} className="spin-icon" color="var(--accent)" />
          <h3>Synchronizing with Cloud...</h3>
        </div>
      ) : history.length === 0 ? (
        <div className="empty-state-full">
          <History size={48} color="var(--text-muted)" />
          <h3>No history yet</h3>
          <p>Your code analyses will appear here safely in the cloud.</p>
        </div>
      ) : (
        <div className="history-layout">
          {/* List */}
          <div className="history-list">
            <div className="search-bar">
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search history..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="btn-icon" onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="list-items">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  className={`history-item ${selected?.id === item.id ? "active" : ""}`}
                  onClick={() => setSelected(item)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="item-top">
                    <span className="badge badge-gold">{item.language || "code"}</span>
                    <span
                      className="item-score"
                      style={{ color: getScoreColor(item.result?.score || 0) }}
                    >
                      {item.result?.score || "--"}
                    </span>
                  </div>
                  <div className="item-code">{(item.code || "").slice(0, 80)}...</div>
                  <div className="item-bottom">
                    <span className="item-date">
                      <Calendar size={12} />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Detail View */}
          <div className="history-detail">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ height: "100%" }}
                >
                  {selected.result ? (
                    <ResultsTabs results={selected.result} />
                  ) : (
                    <div className="detail-empty">
                      <p>No detailed results available for this snippet.</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="detail-empty">
                  <ChevronRight size={32} color="var(--text-muted)" />
                  <p>Select an analysis to view details</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <style jsx>{`
        .history-page {
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: calc(100vh - var(--navbar-height) - 48px);
        }
        .history-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .page-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 22px;
          font-weight: 700;
        }
        .page-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .empty-state-full {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          gap: 12px;
          text-align: center;
        }
        .empty-state-full h3 {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .empty-state-full p {
          font-size: 14px;
          color: var(--text-muted);
        }
        .spin-icon {
          animation: spin 1s linear infinite;
        }
        .history-layout {
          flex: 1;
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 16px;
          min-height: 0;
        }
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 0;
        }
        .search-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
        }
        .search-bar input {
          flex: 1;
          font-size: 13px;
          color: var(--text-primary);
          background: transparent;
          border: none;
          outline: none;
        }
        .search-bar input::placeholder {
          color: var(--text-muted);
        }
        .list-items {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .history-item {
          padding: 14px 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          background: var(--card);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .history-item:hover {
          border-color: var(--accent-soft);
        }
        .history-item.active {
          border-color: var(--accent);
          background: var(--accent-soft);
        }
        .item-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .item-score {
          font-size: 18px;
          font-weight: 700;
        }
        .item-code {
          font-size: 12px;
          color: var(--text-muted);
          font-family: 'JetBrains Mono', monospace;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .item-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
        }
        .item-date {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--text-muted);
        }
        .history-detail {
          min-height: 0;
          overflow: hidden;
        }
        .detail-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 8px;
          border-radius: var(--radius-lg);
          border: 1px dashed var(--border);
        }
        .detail-empty p {
          font-size: 14px;
          color: var(--text-muted);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .history-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
