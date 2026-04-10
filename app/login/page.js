"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Shield, ArrowRight, Code2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    try {
      await signInWithGoogle();
      toast.success("Welcome to CodeReview AI");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Authentication failed. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (loading) {
    return (
      <div style={s.loadingPage}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={s.loadingSpinner}
        />
      </div>
    );
  }

  if (user) return null;

  return (
    <div style={s.pageContainer}>
      {/* Navbar Minimal */}
      <nav style={s.nav}>
        <div style={s.navContent}>
          <div style={s.logoGroup} onClick={() => router.push("/")}>
            <div style={s.logoIcon}><Code2 size={20} /></div>
            <span style={s.logoText}>CodeReview AI</span>
          </div>
          <div style={s.navRight}>
            <span style={s.navPrompt}>New here?</span>
            <button style={s.ghostBtn} onClick={handleGoogleLogin}>Create account</button>
          </div>
        </div>
      </nav>

      <div style={s.splitLayout} className="split-layout-root">
        {/* Left Side: Visual/Branding */}
        <section style={s.visualSection} className="visual-section-root">
          <div style={s.visualContent}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 style={s.headline} className="headline-root">
                Write better code. <br />
                Ship faster.
              </h1>
              <p style={s.subtext} className="subtext-root">
                AI-powered code review that helps you catch bugs, improve quality, and move faster than ever.
              </p>
            </motion.div>

            <motion.div 
              style={s.imageContainer}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <img 
                src="/auth_visual_coding_ai_1775841128607.png" 
                alt="Product Visual" 
                style={s.heroImage}
              />
              <div style={s.imageOverlay} />
            </motion.div>

            <div style={s.trustBar} className="trust-bar-root">
              <span style={s.trustLabel}>TRUSTED BY TEAMS AT</span>
              <div style={s.trustLogos}>
                <span style={s.trustLogo}>VERCEL</span>
                <span style={s.trustLogo}>GITHUB</span>
                <span style={s.trustLogo}>STRIPE</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Auth Form */}
        <section style={s.formSection} className="form-section-root">
          <motion.div 
            style={s.formCard}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div style={s.formHeader}>
              <h2 style={s.formTitle}>Welcome back</h2>
              <p style={s.formSubtitle}>Sign in to your account to continue</p>
            </div>

            <div style={s.formBody}>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
                whileTap={{ scale: 0.98 }}
                style={s.googleBtn}
                onClick={handleGoogleLogin}
                disabled={isAuthenticating}
              >
                {isAuthenticating ? (
                  <div style={s.btnLoading} />
                ) : (
                  <>
                    <GoogleIcon />
                    <span>Continue with Google</span>
                  </>
                )}
              </motion.button>

              <div style={s.divider}>
                <div style={s.dividerLine} />
                <span style={s.dividerText}>secure login</span>
                <div style={s.dividerLine} />
              </div>

              <div style={s.trustElements}>
                <div style={s.trustItem}>
                  <Shield size={14} color="#6B7280" />
                  <span>Enterprise-grade security</span>
                </div>
                <div style={s.trustItem}>
                  <Lock size={14} color="#6B7280" />
                  <span>SOC2 & GDPR Compliant</span>
                </div>
              </div>
            </div>
          </motion.div>

          <footer style={s.footer}>
            <p>© 2026 CodeReview AI. Built for developers.</p>
          </footer>
        </section>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        
        @media (max-width: 1024px) {
          .split-layout-root { 
            flex-direction: column !important; 
          }
          .visual-section-root { 
            border-right: none !important;
            border-bottom: 1px solid #E5E7EB !important;
            padding: 40px 24px !important;
            min-height: auto !important;
          }
          .form-section-root {
            padding: 40px 24px !important;
            min-height: auto !important;
          }
          .headline-root {
            font-size: 36px !important;
            text-align: center !important;
          }
          .subtext-root {
            text-align: center !important;
            margin: 0 auto 32px auto !important;
          }
          .trust-bar-root {
            margin-top: 40px !important;
            align-items: center !important;
          }
        }
      `}</style>
    </div>
  );
}

const s = {
  pageContainer: {
    minHeight: "100vh",
    background: "#F9FAFB",
    color: "#111827",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#F9FAFB",
  },
  loadingSpinner: {
    width: "24px",
    height: "24px",
    border: "2px solid rgba(37, 99, 235, 0.1)",
    borderTopColor: "#2563EB",
    borderRadius: "50%",
  },
  nav: {
    padding: "24px 40px",
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 10,
  },
  navContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  logoIcon: {
    width: "32px",
    height: "32px",
    background: "#2563EB",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFF",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  navPrompt: {
    fontSize: "14px",
    color: "#6B7280",
  },
  ghostBtn: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#2563EB",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: "6px",
    transition: "background 0.2s",
  },
  splitLayout: {
    display: "flex",
    flex: 1,
    minHeight: "100vh",
  },
  visualSection: {
    flex: 1,
    background: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px",
    borderRight: "1px solid #E5E7EB",
    position: "relative",
    overflow: "hidden",
  },
  visualContent: {
    maxWidth: "540px",
    position: "relative",
    zIndex: 2,
  },
  headline: {
    fontSize: "56px",
    fontWeight: "700",
    lineHeight: "1.1",
    letterSpacing: "-2px",
    marginBottom: "20px",
    color: "#111827",
  },
  subtext: {
    fontSize: "18px",
    color: "#6B7280",
    lineHeight: "1.6",
    marginBottom: "60px",
    maxWidth: "420px",
  },
  imageContainer: {
    borderRadius: "24px",
    background: "#FFF",
    padding: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
    border: "1px solid #E5E7EB",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    borderRadius: "16px",
    display: "block",
  },
  imageOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(255,255,255,0.1), transparent)",
    borderRadius: "16px",
  },
  trustBar: {
    marginTop: "80px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  trustLabel: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: "1px",
  },
  trustLogos: {
    display: "flex",
    gap: "32px",
    opacity: 0.4,
  },
  trustLogo: {
    fontSize: "14px",
    fontWeight: "900",
    letterSpacing: "-0.5px",
  },
  formSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    background: "#FFFFFF",
  },
  formCard: {
    width: "100%",
    maxWidth: "420px",
    padding: "40px",
    background: "#FFF",
    borderRadius: "20px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 8px 16px rgba(0,0,0,0.02)",
  },
  formHeader: {
    textAlign: "center",
    marginBottom: "32px",
  },
  formTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "8px",
  },
  formSubtitle: {
    fontSize: "14px",
    color: "#6B7280",
  },
  formBody: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  googleBtn: {
    width: "100%",
    height: "52px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#1F2937",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "12px 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#F1F5F9",
  },
  dividerText: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#CBD5E1",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
  },
  trustElements: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "8px",
  },
  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "13px",
    color: "#6B7280",
  },
  btnLoading: {
    width: "20px",
    height: "20px",
    border: "2px solid #E5E7EB",
    borderTopColor: "#2563EB",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },
  footer: {
    marginTop: "auto",
    padding: "20px",
    fontSize: "13px",
    color: "#94A3B8",
    textAlign: "center",
  },
  /* Media Queries for Responsive Stacking (implemented via inline logic if needed) */
};
