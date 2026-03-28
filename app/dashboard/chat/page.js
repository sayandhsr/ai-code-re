"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";

const SUGGESTIONS = [
  "Write a React todo app",
  "Explain async/await in JavaScript",
  "Optimize a slow database query",
  "Create a Python class for caching",
  "Explain the SOLID principles",
  "Write unit tests for a function",
];

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history: messages.slice(-10),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || data.error || "No response" },
      ]);
    } catch {
      toast.error("Failed to get response");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-area">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles size={48} color="var(--gold)" />
            </motion.div>
            <h2>AI Chat Assistant</h2>
            <p>Ask anything about code, architecture, or best practices</p>
            <div className="suggestions-grid">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="suggestion-chip"
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className={`message ${msg.role}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="msg-icon">
                  {msg.role === "user" ? <User size={16} /> : <Bot size={16} color="var(--gold)" />}
                </div>
                <div className="msg-body">
                  <span className="msg-role">
                    {msg.role === "user" ? "You" : "AI Assistant"}
                  </span>
                  <div className="msg-text">
                    {msg.role === "assistant" ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <div className="msg-icon"><Bot size={16} color="var(--gold)" /></div>
                <div className="msg-body">
                  <span className="msg-role">AI Assistant</span>
                  <div className="typing"><span /><span /><span /></div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <div className="input-bar">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
          }}
          placeholder="Ask anything..."
          rows={1}
        />
        <button
          className="send"
          onClick={() => sendMessage()}
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? <Loader2 size={18} className="spin-anim" /> : <Send size={18} />}
        </button>
      </div>

      <style jsx>{`
        .chat-page {
          display: flex;
          flex-direction: column;
          min-height: calc(100vh - var(--navbar-height) - 48px);
          max-width: 800px;
          margin: 0 auto;
          padding-top: 0;
        }
        .chat-area {
          flex: 1;
          overflow-y: auto;
          padding: 20px 0;
        }
        .chat-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding-top: 24px;
          height: 100%;
          text-align: center;
          gap: 8px;
        }
        .chat-empty h2 {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .chat-empty p {
          font-size: 14px;
          color: var(--text-muted);
        }
        .suggestions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 24px;
          max-width: 500px;
        }
        .suggestion-chip {
          padding: 10px 16px;
          border-radius: var(--radius-md);
          background: var(--dark-gray);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          font-size: 13px;
          text-align: left;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .suggestion-chip:hover {
          border-color: rgba(212, 175, 55, 0.3);
          background: var(--gold-subtle);
          color: var(--gold);
        }
        .messages {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .message {
          display: flex;
          gap: 12px;
        }
        .msg-icon {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--dark-gray-2);
          color: var(--text-secondary);
        }
        .message.assistant .msg-icon {
          background: var(--gold-subtle);
        }
        .msg-body {
          flex: 1;
          min-width: 0;
        }
        .msg-role {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
          display: block;
        }
        .msg-text {
          font-size: 14px;
          line-height: 1.7;
          color: var(--text-secondary);
        }
        .msg-text pre {
          padding: 12px;
          border-radius: var(--radius-sm);
          background: var(--dark-gray);
          overflow-x: auto;
          margin: 8px 0;
          font-size: 13px;
        }
        .msg-text code {
          padding: 2px 6px;
          border-radius: 4px;
          background: var(--dark-gray-2);
          font-size: 13px;
        }
        .msg-text pre code { padding: 0; background: none; }
        .typing {
          display: flex;
          gap: 4px;
          padding: 8px 0;
        }
        .typing span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold);
          animation: pulse 1.4s ease-in-out infinite;
        }
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }
        .input-bar {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          padding: 16px 0 4px;
          border-top: 1px solid var(--glass-border);
        }
        .input-bar textarea {
          flex: 1;
          padding: 12px 16px;
          border-radius: var(--radius-lg);
          background: var(--dark-gray);
          border: 1px solid var(--glass-border);
          color: var(--text-primary);
          font-size: 14px;
          resize: none;
          max-height: 120px;
          line-height: 1.5;
          transition: border-color var(--transition-fast);
        }
        .input-bar textarea:focus {
          border-color: rgba(212, 175, 55, 0.4);
        }
        .input-bar textarea::placeholder {
          color: var(--text-muted);
        }
        .send {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--gold), var(--gold-dim));
          color: var(--black);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .send:hover:not(:disabled) { box-shadow: var(--shadow-gold); }
        .send:disabled { opacity: 0.5; cursor: not-allowed; }
        .spin-anim { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
