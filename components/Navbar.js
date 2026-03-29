"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Search, Bell, GitBranch, Menu, X, LogOut, User, Sparkles, Code2, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out successfully");
    router.push("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="sidebar-toggle btn-icon" onClick={onToggleSidebar}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="navbar-brand">
          <div className="navbar-logo">
            <Code2 size={20} color={theme === "dark" ? "#1A1A1A" : "#FFFFFF"} strokeWidth={2.5} />
          </div>
          <span className="navbar-title">CodeReview AI</span>
        </div>
      </div>

      <div className="navbar-center">
        <div className="navbar-search">
          <Search size={16} />
          <input type="text" placeholder="Search or ask AI... (Ctrl+K)" readOnly />
          <kbd>⌘K</kbd>
        </div>
      </div>

      <div className="navbar-right">
        <motion.button
          className="btn-icon"
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>

        {user && (
          <div className="navbar-user">
            <img
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'U'}&background=D4AF37&color=0D0D0D&bold=true`}
              alt={user.displayName}
              className="navbar-avatar"
            />
            <motion.button
              className="btn-icon"
              onClick={handleLogout}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Sign out"
            >
              <LogOut size={18} />
            </motion.button>
          </div>
        )}
      </div>

      <style jsx>{`
        .navbar {
          position: relative;
          height: var(--navbar-height);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0;
          background: transparent;
          border-bottom: 1px solid var(--border);
          margin-bottom: 16px;
        }
        .navbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .navbar-logo {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }
        .navbar-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.5px;
        }
        .navbar-center {
          flex: 1;
          max-width: 460px;
          margin: 0 32px;
        }
        .navbar-search {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          color: var(--text-muted);
          transition: all var(--transition-normal);
          cursor: pointer;
        }
        .navbar-search:hover {
          background: var(--border);
          border-color: var(--text-muted);
        }
        .navbar-search input {
          flex: 1;
          font-size: 14px;
          color: var(--text-primary);
          background: transparent;
          border: none;
          outline: none;
        }
        .navbar-search kbd {
          padding: 3px 8px;
          border-radius: 6px;
          background: var(--border);
          font-size: 12px;
          color: var(--text-muted);
          border: 1px solid var(--border);
        }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .navbar-user {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: 12px;
          padding-left: 16px;
          border-left: 1px solid var(--glass-border);
        }
        .navbar-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid var(--gold-subtle);
        }
        .sidebar-toggle {
          display: flex;
          color: var(--text-muted);
        }
        .sidebar-toggle:hover {
          color: var(--gold);
        }
        @media (max-width: 768px) {
          .navbar-center { display: none; }
          .navbar-title { display: none; }
        }
      `}</style>
    </nav>
  );
}
