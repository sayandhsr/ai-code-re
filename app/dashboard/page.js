"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Play, MessageSquare, Download, FileDown, GitBranch,
  Loader2, Sparkles, Keyboard, ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import ResultsTabs from "@/components/ResultsTabs";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import { saveAnalysis } from "@/lib/history";
import { exportAsPdf, exportAsMarkdown } from "@/lib/export";

const CodeEditor = dynamic(() => import("@/components/CodeEditor"), { ssr: false });

export default function DashboardPage() {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");

  // Keyboard shortcut: Ctrl+Enter to analyze
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (code.trim() && !isAnalyzing) handleAnalyze();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [code, isAnalyzing]);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code first");
      return;
    }
    setIsAnalyzing(true);
    setResults(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setResults(data);
      await saveAnalysis({ code, language, result: data }, user);
      toast.success("Analysis complete!");
    } catch (err) {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGithubFetch = async () => {
    if (!githubUrl.trim()) return;

    try {
      toast.loading("Fetching repository...", { id: "github" });
      const res = await fetch("/api/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: githubUrl }),
      });
      const data = await res.json();

      if (data.error) {
        toast.error(data.error, { id: "github" });
        return;
      }

      if (data.files?.length > 0) {
        // Fetch first code file
        const firstFile = data.files.find((f) =>
          /\.(js|ts|py|java|go|rs|rb|php|c|cpp)$/i.test(f.path)
        ) || data.files[0];

        const fileRes = await fetch("/api/github", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner: data.owner,
            repo: data.repo,
            path: firstFile.path,
          }),
        });
        const fileData = await fileRes.json();

        if (fileData.content) {
          setCode(fileData.content);
          const ext = firstFile.path.split(".").pop();
          const langMap = { js: "javascript", ts: "typescript", py: "python", java: "java", go: "go", rs: "rust", rb: "ruby", php: "php", c: "c", cpp: "cpp" };
          if (langMap[ext]) setLanguage(langMap[ext]);
          toast.success(`Loaded ${firstFile.path}`, { id: "github" });
        }
      } else {
        toast.error("No code files found", { id: "github" });
      }
    } catch {
      toast.error("Failed to fetch repository", { id: "github" });
    }
  };

  return (
    <div className="dashboard-content-flow">
      {/* 1. TOP SECTION (Hero Editor) */}
      <section className="editor-hero-section">
        <div className="workspace-hero hero-card">
          <div className="top-header">
            <div className="header-brand">
              <Sparkles size={20} color="var(--gold)" />
              <h1 className="header-title">Code Analysis</h1>
            </div>
            <div className="header-info">
              <div className="info-item">
                <Keyboard size={14} color="var(--text-muted)" />
                <span>Ctrl + Enter</span>
              </div>
              {results && (
                <div className="header-exports">
                  <button className="btn-icon-sm" onClick={() => exportAsPdf(results, code)} title="Export PDF">
                    <FileDown size={14} />
                  </button>
                  <button className="btn-icon-sm" onClick={() => exportAsMarkdown(results, code)} title="Export MD">
                    <Download size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="editor-wrapper gold-glow">
            <CodeEditor
              code={code}
              onCodeChange={setCode}
              language={language}
              onLanguageChange={setLanguage}
            />
          </div>

          <div className="action-bar">
            <div className="github-group">
              <div className="github-input-wrapper">
                <GitBranch size={16} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="https://github.com/user/repo"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGithubFetch()}
                />
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleGithubFetch}>
                Fetch
              </button>
            </div>

            <div className="primary-actions">
              <motion.button
                className="btn btn-primary analyze-btn"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !code.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={18} className="spin-icon" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Analyze Code
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. RESULTS SECTION */}
      <section className="results-section section-gap">
        <div className="section-header">
          <ChevronRight size={20} color="var(--gold)" />
          <h2 className="section-title">Analysis Results</h2>
        </div>
        
        <div className="results-container">
          {isAnalyzing ? (
            <div className="loading-container">
              <LoadingSkeleton />
            </div>
          ) : results ? (
            <ResultsTabs results={results} />
          ) : (
            <div className="empty-state glass">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="empty-content"
              >
                <div className="empty-orb">
                  <Sparkles size={40} color="var(--gold)" />
                </div>
                <h3>Ready for Review</h3>
                <p>Paste your code above or fetch from GitHub to start the intelligent analysis.</p>
                <div className="feature-grid">
                  <span>🐞 Bugs</span>
                  <span>🔒 Security</span>
                  <span>✨ Quality</span>
                  <span>🔁 Refactor</span>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .dashboard-content-flow {
          display: flex;
          flex-direction: column;
          padding-bottom: 80px;
          margin-top: 0;
        }

        .editor-hero-section {
          margin-top: 0;
        }

        .workspace-hero {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 24px;
        }

        .top-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .header-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .header-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .header-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .info-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-muted);
          background: var(--dark-gray-2);
          padding: 4px 10px;
          border-radius: 6px;
        }

        .editor-wrapper {
          height: 440px;
          border-radius: 16px;
          overflow: hidden;
          background: var(--black);
          border: none;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          transition: var(--transition-normal);
        }
        .editor-wrapper:focus-within {
          border-color: var(--gold);
          box-shadow: 0 0 0 1px var(--gold), var(--shadow-gold);
        }

        .action-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .github-group {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }
        .github-input-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          background: var(--dark-gray-2);
          border: 1px solid var(--glass-border);
          padding: 10px 16px;
          border-radius: var(--radius-md);
        }
        .github-input-wrapper input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: 14px;
          color: var(--text-primary);
        }

        /* Results Section */
        .results-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-left: 8px;
        }
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .results-container {
          min-height: 400px;
        }

        .analyze-btn {
          min-width: 160px;
        }

        .empty-state {
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-xl);
          border: 1px solid var(--glass-border);
        }
        .empty-content {
          text-align: center;
        }
        .empty-orb {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          border-radius: 50%;
          background: var(--gold-glow);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .empty-state h3 {
          font-size: 20px;
          margin-bottom: 8px;
        }
        .empty-state p {
          font-size: 14px;
          color: var(--text-muted);
          max-width: 300px;
          margin: 0 auto;
        }
        .feature-grid {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 24px;
        }
        .feature-grid span {
          background: var(--dark-gray-2);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 12px;
          border: 1px solid var(--glass-border);
        }

        @media (max-width: 768px) {
          .action-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .editor-wrapper {
            height: 340px;
          }
        }
      `}</style>
    </div>
  );
}
