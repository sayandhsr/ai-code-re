"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  GitBranch, // Changed from GitHub to GitBranch
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/chat", icon: MessageSquare, label: "AI Chat" },
  { href: "/dashboard/github", icon: GitBranch, label: "GitHub Analyzer" }, // Icon changed to GitBranch
  { href: "/dashboard/history", icon: History, label: "History" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar({ collapsed, onToggle }) {
  const pathname = usePathname();

  return (
    <motion.aside
      className={`sidebar ${collapsed ? "collapsed" : "expanded"}`}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="sidebar-inner">
        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`sidebar-item ${isActive ? "active" : ""}`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="sidebar-icon">
                    <Icon size={20} />
                  </div>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        className="sidebar-label"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="sidebar-indicator"
                      layoutId="sidebarIndicator"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="sidebar-bottom">
          {!collapsed && (
            <motion.div
              className="sidebar-promo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Sparkles size={16} color="#D4AF37" />
              <span>Powered by AI</span>
            </motion.div>
          )}

          <button className="sidebar-collapse-btn btn-icon" onClick={onToggle}>
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 1000; /* High z-index above everything */
          background: rgba(13, 13, 13, 0.98);
          border-right: 1px solid var(--glass-border);
          overflow: hidden;
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.5);
        }
        .sidebar-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 24px 16px;
          justify-content: space-between;
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 20px;
        }
        .sidebar-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          transition: all var(--transition-normal);
          cursor: pointer;
        }
        .sidebar-item:hover {
          background: var(--dark-gray-3);
          color: var(--text-primary);
        }
        .sidebar-item.active {
          color: var(--gold);
          background: var(--gold-subtle);
        }
        .sidebar-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
        }
        .sidebar-label {
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
        }
        .sidebar-indicator {
          position: absolute;
          left: -4px;
          top: 8px;
          bottom: 8px;
          width: 4px;
          border-radius: 0 4px 4px 0;
          background: var(--gold);
          box-shadow: 2px 0 10px var(--gold-glow);
        }
        .sidebar-bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .sidebar-promo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: var(--radius-md);
          background: var(--gold-subtle);
          font-size: 11px;
          font-weight: 600;
          color: var(--gold);
          width: 100%;
          border: 1px solid rgba(212, 175, 55, 0.1);
        }
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          .sidebar.mobile-open {
            transform: translateX(0);
          }
        }
      `}</style>
    </motion.aside>
  );
}
