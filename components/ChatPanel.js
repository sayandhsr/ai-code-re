"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Sparkles, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SUGGESTIONS = [
  "Explain this code",
  "Find edge cases",
  "Optimize performance",
  "Add error handling",
];

export default function ChatPanel({ code, isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;

    const userMsg = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          code,
          history: messages.slice(-10),
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="chat-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <Bot size={18} color="var(--gold)" />
              <span>AI Assistant</span>
            </div>
            <button className="btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-welcome">
                <Sparkles size={32} color="var(--gold)" />
                <h3>Ask about your code</h3>
                <p>Get explanations, suggestions, or ask any coding question</p>
                <div className="chat-suggestions">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      className="suggestion-btn"
                      onClick={() => sendMessage(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className={`chat-message ${msg.role}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="msg-avatar">
                  {msg.role === "user" ? (
                    <User size={14} />
                  ) : (
                    <Bot size={14} color="var(--gold)" />
                  )}
                </div>
                <div className="msg-content">
                  {msg.role === "assistant" ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="chat-message assistant">
                <div className="msg-avatar">
                  <Bot size={14} color="var(--gold)" />
                </div>
                <div className="msg-content">
                  <div className="typing-indicator">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-container">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your code..."
              rows={1}
              className="chat-input"
            />
            <button
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
            </button>
          </div>

          <style jsx>{`
            .chat-panel {
              display: flex;
              flex-direction: column;
              height: 100%;
              border-radius: var(--radius-xl);
              border: 1px solid var(--glass-border);
              background: var(--dark-gray);
              overflow: hidden;
              box-shadow: var(--shadow-sm);
            }
            .chat-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 12px 16px;
              border-bottom: 1px solid var(--glass-border);
              background: var(--dark-gray-2);
            }
            .chat-header-left {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 14px;
              font-weight: 600;
              color: var(--text-primary);
            }
            .chat-messages {
              flex: 1;
              overflow-y: auto;
              padding: 16px;
            }
            .chat-welcome {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              padding: 40px 20px;
              gap: 8px;
            }
            .chat-welcome h3 {
              font-size: 16px;
              font-weight: 600;
              color: var(--text-primary);
            }
            .chat-welcome p {
              font-size: 13px;
              color: var(--text-muted);
            }
            .chat-suggestions {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 8px;
              margin-top: 16px;
            }
            .suggestion-btn {
              padding: 6px 14px;
              border-radius: 100px;
              background: var(--gold-subtle);
              color: var(--gold);
              font-size: 12px;
              font-weight: 500;
              cursor: pointer;
              transition: all var(--transition-fast);
              border: 1px solid rgba(212, 175, 55, 0.2);
            }
            .suggestion-btn:hover {
              background: rgba(212, 175, 55, 0.15);
              border-color: var(--gold);
            }
            .chat-message {
              display: flex;
              gap: 10px;
              margin-bottom: 16px;
            }
            .msg-avatar {
              flex-shrink: 0;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: var(--dark-gray-2);
              color: var(--text-secondary);
            }
            .chat-message.assistant .msg-avatar {
              background: var(--gold-subtle);
            }
            .msg-content {
              flex: 1;
              font-size: 14px;
              line-height: 1.6;
              color: var(--text-secondary);
              overflow-x: auto;
            }
            .msg-content p {
              margin-bottom: 8px;
            }
            .msg-content pre {
              padding: 12px;
              border-radius: var(--radius-sm);
              background: var(--black-light);
              overflow-x: auto;
              margin: 8px 0;
              font-size: 13px;
            }
            .msg-content code {
              padding: 2px 6px;
              border-radius: 4px;
              background: var(--dark-gray-2);
              font-size: 13px;
            }
            .msg-content pre code {
              padding: 0;
              background: none;
            }
            .typing-indicator {
              display: flex;
              gap: 4px;
              padding: 8px 0;
            }
            .typing-indicator span {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: var(--gold);
              animation: pulse 1.4s ease-in-out infinite;
            }
            .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
            .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
            .chat-input-container {
              display: flex;
              align-items: flex-end;
              gap: 8px;
              padding: 12px 16px;
              border-top: 1px solid var(--glass-border);
              background: var(--dark-gray-2);
            }
            .chat-input {
              flex: 1;
              padding: 10px 14px;
              border-radius: var(--radius-md);
              background: var(--dark-gray-2);
              border: 1px solid var(--glass-border);
              color: var(--text-primary);
              font-size: 14px;
              resize: none;
              max-height: 100px;
              line-height: 1.4;
              transition: border-color var(--transition-fast);
            }
            .chat-input:focus {
              border-color: rgba(212, 175, 55, 0.4);
            }
            .chat-input::placeholder {
              color: var(--text-muted);
            }
            .send-btn {
              width: 40px;
              height: 40px;
              border-radius: var(--radius-md);
              background: linear-gradient(135deg, var(--gold), var(--gold-dim));
              color: var(--black);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all var(--transition-fast);
              flex-shrink: 0;
            }
            .send-btn:hover:not(:disabled) {
              box-shadow: var(--shadow-gold);
            }
            .send-btn:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
            .spin {
              animation: spin 1s linear infinite;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
