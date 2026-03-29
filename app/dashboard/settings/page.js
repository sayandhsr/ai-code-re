"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Sun, Moon, Key, User, Palette, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [defaultLanguage, setDefaultLanguage] = useState("javascript");
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);

  return (
    <div className="settings-container">
      <header className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your account and app preferences</p>
      </header>

      <div className="settings-stack">
        {/* Profile Section */}
        <motion.section 
          className="settings-card hero-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card-header">
            <User size={18} className="icon-gold" />
            <h3>Profile</h3>
          </div>
          <div className="profile-display">
            <div className="avatar-wrapper">
              <img
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'U'}&background=D4AF37&color=0D0D0D&bold=true`}
                alt="Profile"
                className="user-avatar"
              />
              <div className="avatar-badge" />
            </div>
            <div className="user-details">
              <div className="user-name">{user?.displayName || "Developer"}</div>
              <div className="user-email">{user?.email || "No email provided"}</div>
              <span className="user-badge">Pro Plan</span>
            </div>
          </div>
        </motion.section>

        {/* Appearance Section */}
        <motion.section 
          className="settings-card hero-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card-header">
            <Palette size={18} className="icon-gold" />
            <h3>Appearance</h3>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Interface Theme</div>
              <div className="setting-desc">Switch between light and dark modes</div>
            </div>
            <button className="theme-toggle-pill" onClick={toggleTheme}>
              <div className={`pill-track ${theme}`}>
                <div className="pill-thumb">
                  {theme === "dark" ? <Moon size={12} /> : <Sun size={12} />}
                </div>
              </div>
              <span className="pill-text">{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
            </button>
          </div>
        </motion.section>

        {/* Preferences Section */}
        <motion.section 
          className="settings-card hero-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-header">
            <Settings size={18} className="icon-gold" />
            <h3>Preferences</h3>
          </div>
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Default Language</div>
                <div className="setting-desc">Primary programming language for analysis</div>
              </div>
              <select 
                className="setting-select" 
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="go">Go</option>
              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Editor Font Size</div>
                <div className="setting-desc">Adjust the typography of the code editor</div>
              </div>
              <div className="font-control">
                <button onClick={() => setFontSize(Math.max(12, fontSize - 1))}>-</button>
                <span>{fontSize}px</span>
                <button onClick={() => setFontSize(Math.min(20, fontSize + 1))}>+</button>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Word Wrap</div>
                <div className="setting-desc">Enable wrapping for long lines of code</div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={wordWrap} 
                  onChange={(e) => setWordWrap(e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section 
          className="settings-card hero-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card-header">
            <Info size={18} className="icon-gold" />
            <h3>About</h3>
          </div>
          <div className="about-grid">
            <div className="about-item">
              <label>Product</label>
              <span>CodeReview AI</span>
            </div>
            <div className="about-item">
              <label>Version</label>
              <span>1.2.4 Premium</span>
            </div>
            <div className="about-item full">
              <label>Description</label>
              <p>An intelligent code analysis environment designed for performance and clarity. Built with cutting-edge AI for modern engineering teams.</p>
            </div>
          </div>
        </motion.section>
      </div>

      <style jsx>{`
        .settings-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 32px;
          padding-bottom: 60px;
        }

        .settings-header {
          margin-bottom: 32px;
          margin-top: 0; /* Strictly flush to navbar margin */
        }
        .settings-title {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.03em;
        }
        .settings-subtitle {
          font-size: 14px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .settings-stack {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .settings-card {
          padding: 24px;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .card-header h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Profile */
        .profile-display {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .avatar-wrapper {
          position: relative;
        }
        .user-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 3px solid var(--gold-subtle);
          object-fit: cover;
        }
        .avatar-badge {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #10B981;
          border: 2px solid var(--dark-gray);
        }
        .user-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .user-name {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .user-email {
          font-size: 14px;
          color: var(--text-muted);
        }
        .user-badge {
          font-size: 11px;
          font-weight: 700;
          color: var(--gold);
          background: var(--gold-subtle);
          padding: 2px 8px;
          border-radius: 4px;
          width: fit-content;
          margin-top: 4px;
          border: 1px solid rgba(212, 175, 55, 0.2);
        }

        /* Setting Items */
        .settings-group {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .setting-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .setting-info {
          flex: 1;
        }
        .setting-label {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .setting-desc {
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        /* Controls */
        .theme-toggle-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg);
          padding: 6px 14px 6px 6px;
          border-radius: 30px;
          border: 1px solid var(--border);
          transition: all var(--transition-normal);
        }
        .theme-toggle-pill:hover {
          border-color: var(--gold-soft);
        }
        .pill-track {
          width: 48px;
          height: 26px;
          background: var(--border);
          border-radius: 20px;
          position: relative;
          transition: 300ms;
        }
        .pill-track.dark { background: var(--gold-subtle); }
        .pill-thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--black);
          transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .pill-track.light .pill-thumb { transform: translateX(22px); }
        .pill-text {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .setting-select {
          background: var(--bg);
          color: var(--text-primary);
          border: 1px solid var(--border);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          min-width: 140px;
          transition: all var(--transition-fast);
        }
        
        .setting-select:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 2px rgba(184,150,46,0.15);
          outline: none;
        }

        .font-control {
          display: flex;
          align-items: center;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }
        .font-control button {
          width: 36px;
          height: 36px;
          color: var(--text-primary);
          background: var(--border);
          font-size: 18px;
        }
        .font-control button:hover { background: var(--glass-hover); }
        .font-control span {
          padding: 0 16px;
          font-size: 14px;
          font-weight: 600;
        }

        /* Toggle Switch */
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: var(--dark-gray-3);
          transition: .4s;
          border-radius: 34px;
        }
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px; width: 18px;
          left: 3px; bottom: 3px;
          background-color: var(--text-muted);
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .toggle-slider { background-color: var(--gold-subtle); }
        input:checked + .toggle-slider:before {
          transform: translateX(20px);
          background-color: var(--gold);
        }

        /* About Grid */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .about-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .about-item.full { grid-column: span 2; }
        .about-item label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .about-item span, .about-item p {
          font-size: 15px;
          color: var(--text-secondary);
        }

        .icon-gold {
          color: var(--gold);
        }
      `}</style>
    </div>
  );
}
