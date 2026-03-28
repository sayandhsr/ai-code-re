"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History, Trash2, Calendar, Code2, BarChart3,
  ChevronRight, AlertTriangle, Search, X,
} from "lucide-react";
import { getHistory, deleteAnalysis, clearHistory } from "@/lib/history";
import ResultsTabs from "@/components/ResultsTabs";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteAnalysis(id);
    setHistory(getHistory());
    if (selected?.id === id) setSelected(null);
    toast.success("Deleted");
  };

  const handleClearAll = () => {
    if (confirm("Clear all history?")) {
      clearHistory();
      setHistory([]);
      setSelected(null);
      toast.success("History cleared");
    }
  };

  const filtered = history.filter((item) =>
    item.language.toLowerCase().includes(search.toLowerCase()) ||
    item.code.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (iso) => {
    const d = new Date(iso);
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
            <History size={22} color="var(--gold)" />
            Analysis History
          </h1>
          <p className="page-subtitle">{history.length} saved analyses</p>
        </div>
        {history.length > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={handleClearAll}>
            <Trash2 size={14} />
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-state-full">
          <History size={48} color="var(--text-muted)" />
          <h3>No history yet</h3>
          <p>Your code analyses will appear here</p>
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
                    <span className="badge badge-gold">{item.language}</span>
                    <span
                      className="item-score"
                      style={{ color: getScoreColor(item.score) }}
                    >
                      {item.score}
                    </span>
                  </div>
                  <div className="item-code">{item.code.slice(0, 80)}...</div>
                  <div className="item-bottom">
                    <span className="item-date">
                      <Calendar size={12} />
                      {formatDate(item.timestamp)}
                    </span>
                    <div className="item-actions">
                      <span className="item-meta">
                        {item.bugsCount > 0 && (
                          <span style={{ color: "var(--red)" }}>
                            {item.bugsCount} bugs
                          </span>
                        )}
                      </span>
                      <button
                        className="btn-icon"
                        onClick={(e) => handleDelete(item.id, e)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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
                  <ResultsTabs results={selected.results} />
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
          background: var(--dark-gray);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
        }
        .search-bar input {
          flex: 1;
          font-size: 13px;
          color: var(--text-primary);
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
          border: 1px solid var(--glass-border);
          background: var(--dark-gray);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .history-item:hover {
          border-color: var(--mid-gray);
        }
        .history-item.active {
          border-color: rgba(212, 175, 55, 0.4);
          background: var(--gold-subtle);
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
        .item-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .item-meta {
          font-size: 11px;
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
          border: 1px dashed var(--glass-border);
        }
        .detail-empty p {
          font-size: 14px;
          color: var(--text-muted);
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
