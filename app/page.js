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

const GoogleIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
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
          <button 
            onClick={handleSignIn}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium transition-all"
          >
            <GoogleIcon size={16} />
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
