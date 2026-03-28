"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch, Search, Loader2, FolderOpen, File, ChevronRight,
  ChevronDown, Check, Square, Play, Code2,
} from "lucide-react";
import toast from "react-hot-toast";

function FileTreeItem({ file, selected, onToggle, depth = 0 }) {
  const isSelected = selected.includes(file.path);
  const fileName = file.path.split("/").pop();
  const ext = fileName.split(".").pop();

  return (
    <motion.div
      className={`tree-item ${isSelected ? "selected" : ""}`}
      style={{ paddingLeft: 16 + depth * 16 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ backgroundColor: "var(--dark-gray-2)" }}
      onClick={() => onToggle(file.path)}
    >
      <div className="tree-check">
        {isSelected ? (
          <Check size={14} color="var(--gold)" />
        ) : (
          <Square size={14} color="var(--text-muted)" />
        )}
      </div>
      <File size={14} color="var(--text-muted)" />
      <span className="tree-name">{fileName}</span>
      <span className="tree-ext">.{ext}</span>
    </motion.div>
  );
}

export default function GitHubPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [files, setFiles] = useState([]);
  const [repoInfo, setRepoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [fileContent, setFileContent] = useState("");
  const [activeFile, setActiveFile] = useState("");

  const fetchRepo = async () => {
    if (!repoUrl.trim()) return;
    setLoading(true);
    setFiles([]);
    setRepoInfo(null);

    try {
      const res = await fetch("/api/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });
      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setFiles(data.files || []);
      setRepoInfo({ owner: data.owner, repo: data.repo });
      toast.success(`Found ${data.totalFiles} files`);
    } catch {
      toast.error("Failed to fetch repository");
    } finally {
      setLoading(false);
    }
  };

  const toggleFile = async (path) => {
    setSelected((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );

    // Load file preview
    if (repoInfo) {
      try {
        const res = await fetch("/api/github", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...repoInfo, path }),
        });
        const data = await res.json();
        if (data.content) {
          setFileContent(data.content);
          setActiveFile(path);
        }
      } catch {}
    }
  };

  const selectAll = () => {
    if (selected.length === files.length) setSelected([]);
    else setSelected(files.map((f) => f.path));
  };

  return (
    <div className="github-page">
      <div className="page-header">
        <h1 className="page-title">
          <GitBranch size={22} color="var(--gold)" />
          GitHub Analyzer
        </h1>
        <p className="page-subtitle">Analyze code from any public GitHub repository</p>
      </div>

      {/* URL Input */}
      <div className="url-bar">
        <GitBranch size={20} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="https://github.com/username/repository"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchRepo()}
          className="url-input"
        />
        <button
          className="btn btn-primary"
          onClick={fetchRepo}
          disabled={loading || !repoUrl.trim()}
        >
          {loading ? <Loader2 size={16} className="spin-anim" /> : <Search size={16} />}
          {loading ? "Fetching..." : "Fetch"}
        </button>
      </div>

      {/* Results */}
      {files.length > 0 && (
        <div className="repo-layout">
          {/* File Tree */}
          <div className="file-tree-panel">
            <div className="tree-header">
              <div className="tree-info">
                <FolderOpen size={16} color="var(--gold)" />
                <span>{repoInfo?.owner}/{repoInfo?.repo}</span>
              </div>
              <div className="tree-actions">
                <button className="btn btn-ghost btn-sm" onClick={selectAll}>
                  {selected.length === files.length ? "Deselect All" : "Select All"}
                </button>
              </div>
            </div>
            <div className="tree-count">
              {selected.length} of {files.length} files selected
            </div>
            <div className="tree-list">
              {files.map((file) => (
                <FileTreeItem
                  key={file.path}
                  file={file}
                  selected={selected}
                  onToggle={toggleFile}
                />
              ))}
            </div>
          </div>

          {/* File Preview */}
          <div className="file-preview-panel">
            {activeFile ? (
              <>
                <div className="preview-header">
                  <Code2 size={16} color="var(--gold)" />
                  <span>{activeFile}</span>
                </div>
                <pre className="preview-code"><code>{fileContent}</code></pre>
              </>
            ) : (
              <div className="preview-empty">
                <File size={32} color="var(--text-muted)" />
                <p>Click a file to preview</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .github-page {
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: calc(100vh - var(--navbar-height) - 48px);
        }
        .page-header { margin-bottom: 4px; }
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
        .url-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          background: var(--dark-gray);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
        }
        .url-input {
          flex: 1;
          font-size: 14px;
          color: var(--text-primary);
        }
        .url-input::placeholder { color: var(--text-muted); }
        .repo-layout {
          flex: 1;
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 16px;
          min-height: 0;
        }
        .file-tree-panel {
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-lg);
          border: 1px solid var(--glass-border);
          background: var(--dark-gray);
          overflow: hidden;
        }
        .tree-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid var(--glass-border);
        }
        .tree-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .tree-count {
          padding: 6px 16px;
          font-size: 12px;
          color: var(--text-muted);
          border-bottom: 1px solid var(--glass-border);
        }
        .tree-list {
          flex: 1;
          overflow-y: auto;
        }
        .tree-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          cursor: pointer;
          transition: background var(--transition-fast);
          font-size: 13px;
          color: var(--text-secondary);
        }
        .tree-item.selected {
          background: var(--gold-subtle);
          color: var(--gold);
        }
        .tree-check { flex-shrink: 0; }
        .tree-name { color: var(--text-primary); }
        .tree-ext {
          color: var(--text-muted);
          font-size: 11px;
        }
        .file-preview-panel {
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-lg);
          border: 1px solid var(--glass-border);
          background: var(--dark-gray);
          overflow: hidden;
        }
        .preview-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--glass-border);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
        }
        .preview-code {
          flex: 1;
          padding: 16px;
          font-size: 13px;
          line-height: 1.6;
          overflow: auto;
          color: var(--text-secondary);
          white-space: pre-wrap;
          word-break: break-word;
        }
        .preview-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 8px;
        }
        .preview-empty p {
          font-size: 14px;
          color: var(--text-muted);
        }
        .spin-anim { animation: spin 1s linear infinite; }
        @media (max-width: 900px) {
          .repo-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
