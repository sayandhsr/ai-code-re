"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Shield, 
  Zap, 
  ArrowRight, 
  Terminal, 
  Code2, 
  CheckCircle2,
  Globe
} from "lucide-react";
import toast from "react-hot-toast";

// Custom Icons for compatibility
const GithubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function LandingPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleSignIn = () => {
    router.push("/login");
  };

  const featureCards = [
    {
      title: "Security Scan",
      badge: "Critical",
      message: "Potential SQL injection found in auth.js",
      color: "rgba(239, 68, 68, 0.1)",
      textColor: "#fca5a5",
      borderColor: "rgba(239, 68, 68, 0.2)",
      icon: <Shield size={14} />
    },
    {
      title: "Optimization",
      badge: "High",
      message: "Array.map() can be optimized for O(1) lookup",
      color: "rgba(245, 158, 11, 0.1)",
      textColor: "#fcd34d",
      borderColor: "rgba(245, 158, 11, 0.2)",
      icon: <Zap size={14} />
    },
    {
      title: "Review Score",
      badge: "88/100",
      message: "Ready for production deployment",
      color: "rgba(16, 185, 129, 0.1)",
      textColor: "#6ee7b7",
      borderColor: "rgba(16, 185, 129, 0.2)",
      icon: <CheckCircle2 size={14} />
    }
  ];

  if (loading) {
    return (
      <div style={s.loadingContainer}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={s.spinner}
        />
      </div>
    );
  }

  if (user) return null;

  return (
    <div style={{ ...s.pageWrapper, "--accent": "#f59e0b" }}>
      <nav style={s.navbar}>
        <div style={s.navbarContent}>
          <div style={s.logoGroup}>
            <div style={s.logoIcon}>
              <Code2 size={20} />
            </div>
            <span style={s.logoText}>CodeReview AI</span>
          </div>
          <button onClick={handleSignIn} style={s.navBtn}>
            <GithubIcon size={16} />
            <span>Sign In</span>
          </button>
        </div>
      </nav>

      <main style={s.main}>
        <div style={s.bgPulse} />

        <div style={s.heroGrid}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={s.heroTextSide}
          >
            <div style={s.badge}>
              <Sparkles size={14} />
              AI Code Analysis V2
            </div>

            <h1 style={s.heroTitle}>
              Review code <br />
              <span style={{ color: "var(--accent)" }}>at the speed of </span> 
              thought.
            </h1>

            <p style={s.heroSubtitle}>
              Eliminate boilerplate reviews. Our neural engine identifies bugs, security flaws, and performance bottlenecks instantly. 
            </p>

            <div style={s.ctaGroup}>
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                style={s.primaryBtn}
              >
                {isSigningIn ? (
                  <div style={s.btnSpinner} />
                ) : (
                  <>
                    <span>Start Reviewing Free</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
              <div style={s.ctaSideNote}>
                <Shield size={16} />
                No credit card required
              </div>
            </div>

            <div style={s.trustedBy}>
              <span style={s.trustedLogo}>MICROSOFT</span>
              <span style={s.trustedLogo}>OPENAI</span>
              <span style={s.trustedLogo}>GITHUB</span>
            </div>
          </motion.div>

          <div style={s.heroVisualSide}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              style={s.browserFrame}
            >
              <div style={s.browserHeader}>
                <div style={s.browserDots}>
                  <div style={{...s.dot, background: "#ff5f56"}} />
                  <div style={{...s.dot, background: "#ffbd2e"}} />
                  <div style={{...s.dot, background: "#27c93f"}} />
                </div>
                <div style={s.browserUrl}>
                  <Globe size={10} />
                  codereview.ai/analyze
                </div>
              </div>

              <div style={s.browserContent}>
                <img 
                  src="/hero-analysis.png"
                  alt="Realistic Analysis Demo"
                  style={s.heroImage}
                />
                <div style={s.imageOverlay} />
                <motion.div 
                  animate={{ y: ["0%", "100%", "0%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={s.scanningLine}
                />
              </div>
            </motion.div>

            {featureCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + idx * 0.2, duration: 0.8 }}
                style={{
                  ...s.floatCard,
                  background: card.color,
                  borderColor: card.borderColor,
                  top: `${15 + idx * 30}%`,
                  right: idx % 2 === 0 ? "-20px" : "-40px"
                }}
              >
                <div style={s.floatCardHeader}>
                  <div style={{...s.floatCardIconTitle, color: card.textColor}}>
                    {card.icon}
                    <span>{card.title}</span>
                  </div>
                  <span style={s.floatCardBadge}>{card.badge}</span>
                </div>
                <p style={s.floatCardText}>{card.message}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <section style={s.socialProof}>
        <div style={s.socialProofContent}>
          <div style={s.avatarStack}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={s.avatar}>
                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" style={s.avatarImg} />
              </div>
            ))}
            <div style={s.avatarCounter}>10k+</div>
          </div>
          <div style={s.socialProofText}>
            <h4 style={s.socialProofTitle}>Loved by developers worldwide</h4>
            <p style={s.socialProofSub}>Join the community of developers who value quality and security.</p>
          </div>
          <div style={s.socialLogos}>
            <span style={s.socLogo}>SOC2</span>
            <span style={s.socLogo}>SECURE</span>
            <span style={s.socLogo}>GDPR</span>
          </div>
        </div>
      </section>

      <footer style={s.footer}>
        © 2026 CodeReview AI – Privacy – Terms – Security
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const s = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#0B0F14",
    color: "#E5E7EB",
    fontFamily: "'Inter', sans-serif",
    overflowX: "hidden",
  },
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0B0F14",
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "2px solid rgba(184, 150, 46, 0.2)",
    borderTopColor: "var(--accent)",
    borderRadius: "50%",
  },
  navbar: {
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 100,
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    background: "rgba(11, 15, 20, 0.8)",
    backdropFilter: "blur(12px)",
  },
  navbarContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoGroup: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    width: "36px",
    height: "36px",
    background: "var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    color: "#0B0F14",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#FFFFFF",
  },
  navBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  main: {
    position: "relative",
    paddingTop: "120px",
    paddingBottom: "80px",
    maxWidth: "1200px",
    margin: "0 auto",
    paddingLeft: "24px",
    paddingRight: "24px",
  },
  bgPulse: {
    position: "absolute",
    top: "-100px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "800px",
    height: "600px",
    background: "rgba(184, 150, 46, 0.05)",
    filter: "blur(120px)",
    borderRadius: "100%",
    zIndex: -1,
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: "60px",
    alignItems: "center",
  },
  heroTextSide: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 14px",
    background: "rgba(184, 150, 46, 0.1)",
    border: "1px solid rgba(184, 150, 46, 0.2)",
    borderRadius: "100px",
    color: "var(--accent)",
    fontSize: "12px",
    fontWeight: "600",
    width: "fit-content",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  heroTitle: {
    fontSize: "64px",
    fontWeight: "800",
    lineHeight: "1.1",
    color: "#FFFFFF",
    letterSpacing: "-1.5px",
  },
  heroSubtitle: {
    fontSize: "20px",
    color: "#9CA3AF",
    lineHeight: "1.6",
    maxWidth: "540px",
  },
  ctaGroup: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginTop: "20px",
  },
  primaryBtn: {
    background: "var(--accent)",
    color: "#0B0F14",
    padding: "16px 32px",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "700",
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(184, 150, 46, 0.2)",
  },
  ctaSideNote: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#6B7280",
    fontWeight: "500",
  },
  btnSpinner: {
    width: "24px",
    height: "24px",
    border: "2px solid rgba(11, 15, 20, 0.2)",
    borderTopColor: "#0B0F14",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },
  trustedBy: {
    display: "flex",
    gap: "32px",
    marginTop: "40px",
    opacity: 0.3,
  },
  trustedLogo: {
    fontSize: "20px",
    fontWeight: "900",
    fontStyle: "italic",
    letterSpacing: "-1px",
  },
  heroVisualSide: {
    position: "relative",
  },
  browserFrame: {
    background: "#161B22",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
  },
  browserHeader: {
    padding: "12px 20px",
    background: "rgba(255, 255, 255, 0.03)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  browserDots: {
    display: "flex",
    gap: "8px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  browserUrl: {
    flex: 1,
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "6px",
    padding: "4px 12px",
    fontSize: "10px",
    color: "#6B7280",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    maxWidth: "200px",
    margin: "0 auto",
  },
  browserContent: {
    position: "relative",
    aspectRatio: "4/3",
    background: "#000",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.8,
  },
  imageOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, #161B22, transparent)",
    opacity: 0.6,
  },
  scanningLine: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "2px",
    background: "rgba(184, 150, 46, 0.4)",
    boxShadow: "0 0 10px rgba(184, 150, 46, 0.4)",
  },
  floatCard: {
    position: "absolute",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid",
    width: "240px",
    zIndex: 10,
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
    backdropFilter: "blur(12px)",
  },
  floatCardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  floatCardIconTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  floatCardBadge: {
    fontSize: "9px",
    fontWeight: "900",
    padding: "2px 6px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "4px",
    color: "#FFF",
  },
  floatCardText: {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: "1.4",
  },
  socialProof: {
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    padding: "60px 24px",
  },
  socialProofContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "40px",
    flexWrap: "wrap",
  },
  avatarStack: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "3px solid #0B0F14",
    background: "#161B22",
    marginLeft: "-12px",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarCounter: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "3px solid #0B0F14",
    background: "var(--accent)",
    marginLeft: "-12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "800",
    color: "#0B0F14",
  },
  socialProofText: {
    flex: 1,
    minWidth: "200px",
  },
  socialProofTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#FFF",
    marginBottom: "4px",
  },
  socialProofSub: {
    fontSize: "14px",
    color: "#6B7280",
  },
  socialLogos: {
    display: "flex",
    gap: "30px",
    opacity: 0.2,
    color: "#FFF",
    fontWeight: "800",
    letterSpacing: "4px",
  },
  socLogo: {
    fontSize: "20px",
  },
  footer: {
    textAlign: "center",
    padding: "40px 24px",
    fontSize: "13px",
    color: "rgba(107, 114, 128, 0.5)",
    fontWeight: "500",
  }
};
