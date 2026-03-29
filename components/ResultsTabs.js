"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, Bug, Lightbulb, Shield, Code2, FileText,
  ChevronDown, ChevronUp, Copy, Check, AlertTriangle,
  CheckCircle2, XCircle, Info,
} from "lucide-react";
import toast from "react-hot-toast";
import ScoreGauge from "./ScoreGauge";

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "bugs", label: "Bugs", icon: Bug },
  { id: "suggestions", label: "Suggestions", icon: Lightbulb },
  { id: "security", label: "Security", icon: Shield },
  { id: "refactored", label: "Refactored Code", icon: Code2 },
  { id: "docs", label: "Documentation", icon: FileText },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="copy-btn btn-icon" title="Copy">
      {copied ? <Check size={14} color="var(--green)" /> : <Copy size={14} />}
    </button>
  );
}

function CollapsibleCard({ title, children, icon: Icon, color, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`result-card ${color || ""}`}>
      <button className="card-header" onClick={() => setOpen(!open)}>
        <div className="card-header-left">
          {Icon && <Icon size={16} />}
          <span>{title}</span>
        </div>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="card-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OverviewTab({ results }) {
  return (
    <div className="overview-tab">
      <div className="overview-grid">
        <div className="overview-score-card analysis-card">
          <ScoreGauge score={results.score} />
          <div className="score-meta">
            <span className="complexity-label">Complexity</span>
            <span className={`complexity-badge badge badge-${
              results.complexity === "Low" ? "green" : results.complexity === "High" ? "red" : "yellow"
            }`}>
              {results.complexity}
            </span>
          </div>
        </div>

        <div className="overview-stats">
          <div className="stat-card analysis-card" style={{ borderLeft: "3px solid var(--red)" }}>
            <XCircle size={20} color="var(--red)" />
            <div>
              <div className="stat-number">{results.bugs?.length || 0}</div>
              <div className="stat-label">Bugs Found</div>
            </div>
          </div>
          <div className="stat-card analysis-card" style={{ borderLeft: "3px solid var(--yellow)" }}>
            <AlertTriangle size={20} color="var(--yellow)" />
            <div>
              <div className="stat-number">{results.suggestions?.length || 0}</div>
              <div className="stat-label">Suggestions</div>
            </div>
          </div>
          <div className="stat-card analysis-card" style={{ borderLeft: "3px solid var(--purple)" }}>
            <Shield size={20} color="var(--purple)" />
            <div>
              <div className="stat-number">{results.security?.length || 0}</div>
              <div className="stat-label">Security Issues</div>
            </div>
          </div>
          <div className="stat-card analysis-card" style={{ borderLeft: "3px solid var(--green)" }}>
            <CheckCircle2 size={20} color="var(--green)" />
            <div>
              <div className="stat-number">{results.score >= 70 ? "Pass" : "Fail"}</div>
              <div className="stat-label">Quality Check</div>
            </div>
          </div>
        </div>
      </div>

      {results.insights && (
        <CollapsibleCard title="AI Insights" icon={Info} color="blue">
          <p className="insights-text">{results.insights}</p>
        </CollapsibleCard>
      )}
    </div>
  );
}

function ListTab({ items, emptyMessage, color, icon: Icon }) {
  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <CheckCircle2 size={40} color="var(--green)" />
        <p>{emptyMessage || "No issues found!"}</p>
      </div>
    );
  }
  return (
    <div className="list-tab">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className={`list-item ${color}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <div className="list-item-icon">
            <Icon size={16} />
          </div>
          <div className="list-item-content">
            <span className="list-item-number">#{i + 1}</span>
            <p>{item}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function CodeTab({ code }) {
  if (!code) {
    return (
      <div className="empty-state">
        <Code2 size={40} color="var(--text-muted)" />
        <p>No refactored code available</p>
      </div>
    );
  }
  return (
    <div className="code-tab">
      <div className="code-tab-header">
        <span>Refactored Code</span>
        <CopyButton text={code} />
      </div>
      <pre className="code-block"><code>{code}</code></pre>
    </div>
  );
}

function DocsTab({ documentation }) {
  if (!documentation) {
    return (
      <div className="empty-state">
        <FileText size={40} color="var(--text-muted)" />
        <p>No documentation generated</p>
      </div>
    );
  }
  return (
    <div className="docs-tab">
      <div className="docs-content">
        <CopyButton text={documentation} />
        <div className="docs-text">{documentation}</div>
      </div>
    </div>
  );
}

export default function ResultsTabs({ results }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!results) return null;

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab results={results} />;
      case "bugs": return <ListTab items={results.bugs} emptyMessage="No bugs found! Your code looks clean." color="red" icon={Bug} />;
      case "suggestions": return <ListTab items={results.suggestions} emptyMessage="No suggestions. Great code!" color="yellow" icon={Lightbulb} />;
      case "security": return <ListTab items={results.security} emptyMessage="No security vulnerabilities detected." color="purple" icon={Shield} />;
      case "refactored": return <CodeTab code={results.refactoredCode} />;
      case "docs": return <DocsTab documentation={results.documentation} />;
      default: return null;
    }
  };

  return (
    <div className="results-wrapper">
      {/* Tab Bar - Sticky */}
      <div className="tab-bar-sticky">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`tab-btn ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span className="tab-label">{tab.label}</span>
              {isActive && (
                <motion.div
                  className="tab-indicator"
                  layoutId="tabIndicator"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="tab-content"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {renderTab()}
        </motion.div>
      </AnimatePresence>

      <style jsx>{`
        .results-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .tab-bar-sticky {
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          gap: 4px;
          padding: 8px 16px;
          background: var(--card-muted);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow-x: auto;
          scrollbar-width: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .tab-bar-sticky::-webkit-scrollbar { display: none; }
        .tab-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
          transition: all var(--transition-normal);
        }
        .tab-btn:hover {
          color: var(--text-primary);
          background: var(--card-muted);
        }
        .tab-btn.active {
          color: var(--accent);
          background: rgba(212, 175, 55, 0.05);
        }
        .tab-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--accent);
          box-shadow: 0 -2px 10px var(--gold-glow);
        }
        .tab-content {
          padding-top: 4px;
        }
        .tab-label {
          display: inline;
        }
        @media (max-width: 768px) {
          .tab-label { display: none; }
          .tab-btn { padding: 8px 10px; }
        }

        /* Overview */
        .overview-grid {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .overview-score-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 24px 32px;
        }
        .score-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .complexity-label {
          font-size: 13px;
          color: var(--text-muted);
        }
        .overview-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
        }
        .stat-number {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .stat-label {
          font-size: 12px;
          color: var(--text-muted);
        }
        .insights-text {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.7;
          white-space: pre-wrap;
        }
        @media (max-width: 900px) {
          .overview-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Cards */
        .analysis-card {
          background: var(--card-muted);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
        }

        .result-card {
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          overflow: hidden;
          margin-bottom: 12px;
        }
        .result-card.blue {
          border-color: rgba(77, 154, 255, 0.2);
          background: var(--blue-bg);
        }
        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 14px 16px;
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background var(--transition-fast);
        }
        .card-header:hover {
          background: var(--card-muted);
        }
        .card-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .card-body {
          padding: 0 16px 16px;
          overflow: hidden;
        }

        /* List Items */
        .list-tab {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .list-item {
          display: flex;
          gap: 12px;
          padding: 14px 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          background: var(--bg-secondary);
        }
        .list-item.red {
          border-left: 3px solid var(--red);
          background: var(--red-bg);
        }
        .list-item.yellow {
          border-left: 3px solid var(--yellow);
          background: var(--yellow-bg);
        }
        .list-item.purple {
          border-left: 3px solid var(--purple);
          background: var(--purple-bg);
        }
        .list-item-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }
        .list-item.red .list-item-icon { color: var(--red); }
        .list-item.yellow .list-item-icon { color: var(--yellow); }
        .list-item.purple .list-item-icon { color: var(--purple); }
        .list-item-content {
          flex: 1;
        }
        .list-item-number {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 2px;
          display: block;
        }
        .list-item-content p {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Code Tab */
        .code-tab {
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          overflow: hidden;
        }
        .code-tab-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          background: var(--card-muted);
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .code-block {
          padding: 16px;
          overflow-x: auto;
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-primary);
          background: var(--bg-secondary);
          white-space: pre-wrap;
          word-break: break-word;
        }

        /* Docs Tab */
        .docs-tab {
          position: relative;
        }
        .docs-content {
          position: relative;
        }
        .docs-content .copy-btn {
          position: absolute;
          top: 0;
          right: 0;
        }
        .docs-text {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.8;
          white-space: pre-wrap;
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 60px 20px;
          text-align: center;
        }
        .empty-state p {
          font-size: 14px;
          color: var(--text-muted);
        }

        /* Copy Button */
        .copy-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          background: none;
          border: none;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .copy-btn:hover {
          background: var(--card-muted);
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
