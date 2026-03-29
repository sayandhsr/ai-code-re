"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Code2, Upload, ChevronDown } from "lucide-react";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const LANGUAGES = [
  "javascript", "typescript", "python", "java", "c", "cpp", "csharp",
  "go", "rust", "php", "ruby", "swift", "kotlin", "html", "css",
  "sql", "bash", "json", "yaml", "markdown",
];

function detectLanguage(code) {
  if (!code) return "javascript";
  const c = code.trim();
  if (c.startsWith("<!DOCTYPE") || c.startsWith("<html") || /<\/?[a-z][\s\S]*>/i.test(c)) return "html";
  if (/^(import|from|def |class |if __name__|print\()/.test(c)) return "python";
  if (/^(package |import "| func )/.test(c)) return "go";
  if (/^(use |fn |let mut |pub |impl |struct )/.test(c)) return "rust";
  if (/^(import java|public class |System\.out)/.test(c)) return "java";
  if (/^(using System|namespace |Console\.)/.test(c)) return "csharp";
  if (/^(<\?php|namespace |use |echo )/.test(c)) return "php";
  if (/(interface |type .*= |: string|: number|: boolean)/.test(c)) return "typescript";
  if (/^(SELECT|INSERT|CREATE|ALTER|DROP)\s/i.test(c)) return "sql";
  if (/^#!/.test(c)) return "bash";
  try { JSON.parse(c); return "json"; } catch {}
  return "javascript";
}

export default function CodeEditor({ code, onCodeChange, language, onLanguageChange }) {
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleEditorChange = useCallback((value) => {
    onCodeChange(value || "");
    if (!language || language === "javascript") {
      const detected = detectLanguage(value || "");
      if (detected !== language) onLanguageChange(detected);
    }
  }, [onCodeChange, onLanguageChange, language]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    const langMap = {
      js: "javascript", jsx: "javascript", ts: "typescript", tsx: "typescript",
      py: "python", java: "java", c: "c", cpp: "cpp", cs: "csharp",
      go: "go", rs: "rust", php: "php", rb: "ruby", swift: "swift",
      kt: "kotlin", html: "html", css: "css", sql: "sql", sh: "bash",
      json: "json", yml: "yaml", yaml: "yaml", md: "markdown",
    };
    if (langMap[ext]) onLanguageChange(langMap[ext]);
    const reader = new FileReader();
    reader.onload = (ev) => onCodeChange(ev.target.result);
    reader.readAsText(file);
  };

  return (
    <div className="code-editor-container">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <Code2 size={16} color="var(--accent)" />
          <span className="toolbar-title">Code Editor</span>
        </div>
        <div className="toolbar-right">
          {/* Language Selector */}
          <div className="lang-selector">
            <button
              className="lang-btn"
              onClick={() => setShowLangMenu(!showLangMenu)}
            >
              <span>{language || "javascript"}</span>
              <ChevronDown size={14} />
            </button>
            {showLangMenu && (
              <div className="lang-menu">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    className={`lang-option ${lang === language ? "active" : ""}`}
                    onClick={() => {
                      onLanguageChange(lang);
                      setShowLangMenu(false);
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Upload */}
          <label className="upload-btn btn-ghost btn-sm">
            <Upload size={14} />
            <span>Upload</span>
            <input
              type="file"
              accept=".js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.cs,.go,.rs,.php,.rb,.swift,.kt,.html,.css,.sql,.sh,.json,.yml,.yaml,.md,.txt"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="editor-wrapper">
        <Editor
          height="100%"
          language={language || "javascript"}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            lineNumbers: "on",
            renderLineHighlight: "line",
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            bracketPairColorization: { enabled: true },
            automaticLayout: true,
            wordWrap: "on",
            tabSize: 2,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            roundedSelection: true,
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
          }}
        />
      </div>

      <style jsx>{`
        .code-editor-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 400px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border);
          background: var(--card);
        }
        .editor-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          background: rgba(26, 26, 26, 0.8);
          border-bottom: 1px solid var(--border);
        }
        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .toolbar-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .lang-selector {
          position: relative;
        }
        .lang-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          border-radius: var(--radius-sm);
          background: var(--card-muted);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          font-size: 12px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .lang-btn:hover {
          border-color: var(--border);
          color: var(--text-primary);
        }
        .lang-menu {
          position: absolute;
          top: 100%;
          right: 0;
          z-index: 50;
          margin-top: 4px;
          padding: 6px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          max-height: 200px;
          overflow-y: auto;
          min-width: 140px;
        }
        .lang-option {
          display: block;
          width: 100%;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 12px;
          color: var(--text-secondary);
          text-align: left;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .lang-option:hover {
          background: var(--card-muted);
          color: var(--text-primary);
        }
        .lang-option.active {
          color: var(--accent);
          background: var(--accent-soft);
        }
        .upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 12px;
        }
        .editor-wrapper {
          flex: 1;
          min-height: 350px;
        }
      `}</style>
    </div>
  );
}
