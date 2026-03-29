"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Sparkles, Shield, Zap, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      toast.success("Welcome! Redirecting...");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Sign in failed. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (user) return null;

  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={styles.bgGradient} />
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />
      <div style={styles.bgOrb3} />
      <div style={styles.gridOverlay} />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={styles.content}
      >
        {/* Logo */}
        <motion.div
          style={styles.logoContainer}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div style={styles.logoIcon}>
            <Code2 size={28} color="#0D0D0D" strokeWidth={2.5} />
          </div>
          <span style={styles.logoText}>CodeReview AI</span>
        </motion.div>

        {/* Card */}
        <motion.div
          style={styles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <div style={styles.cardGlow} />

          <h1 style={styles.title}>
            Write Better Code.
            <br />
            <span style={styles.titleGold}>Instantly.</span>
          </h1>

          <p style={styles.subtitle}>
            AI-powered code analysis that catches bugs, suggests improvements,
            and generates documentation — in seconds.
          </p>

          {/* Features */}
          <div style={styles.features}>
            <div style={styles.featureItem}>
              <Sparkles size={16} color="#D4AF37" />
              <span>AI Analysis</span>
            </div>
            <div style={styles.featureDot} />
            <div style={styles.featureItem}>
              <Shield size={16} color="#D4AF37" />
              <span>Security Scan</span>
            </div>
            <div style={styles.featureDot} />
            <div style={styles.featureItem}>
              <Zap size={16} color="#D4AF37" />
              <span>Instant Results</span>
            </div>
          </div>

          {/* Sign In Button */}
          <motion.button
            onClick={handleSignIn}
            disabled={isSigningIn}
            style={styles.signInBtn}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 30px var(--accent-soft)" }}
            whileTap={{ scale: 0.98 }}
          >
            {isSigningIn ? (
              <div style={styles.btnSpinner} />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Continue with Google</span>
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>

          <p style={styles.terms}>
            By signing in, you agree to our Terms of Service
          </p>
        </motion.div>

        {/* Footer */}
        <motion.p
          style={styles.footer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Trusted by developers worldwide
        </motion.p>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    background: "#0D0D0D",
  },
  bgGradient: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 60%)",
  },
  bgOrb1: {
    position: "absolute",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, transparent 70%)",
    top: "-200px",
    right: "-100px",
    animation: "pulse 6s ease-in-out infinite",
  },
  bgOrb2: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(212, 175, 55, 0.04) 0%, transparent 70%)",
    bottom: "-100px",
    left: "-100px",
    animation: "pulse 8s ease-in-out infinite",
  },
  bgOrb3: {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255, 215, 0, 0.03) 0%, transparent 70%)",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    animation: "pulse 10s ease-in-out infinite",
  },
  gridOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage: `radial-gradient(rgba(212, 175, 55, 0.03) 1px, transparent 1px)`,
    backgroundSize: "40px 40px",
  },
  content: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    width: "100%",
    maxWidth: "460px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "40px",
  },
  logoIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #D4AF37, #FFD700)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 20px var(--accent-soft)",
  },
  logoText: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#F5F5F5",
    letterSpacing: "-0.5px",
  },
  card: {
    position: "relative",
    width: "100%",
    padding: "40px 36px",
    background: "rgba(26, 26, 26, 0.6)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(212, 175, 55, 0.15)",
    borderRadius: "24px",
    textAlign: "center",
  },
  cardGlow: {
    position: "absolute",
    top: "-1px",
    left: "20%",
    right: "20%",
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    lineHeight: "1.2",
    color: "#F5F5F5",
    marginBottom: "16px",
    letterSpacing: "-1px",
  },
  titleGold: {
    background: "linear-gradient(135deg, #D4AF37, #FFD700)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: "15px",
    color: "#A0A0A0",
    lineHeight: "1.6",
    marginBottom: "28px",
    maxWidth: "360px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  features: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "32px",
    flexWrap: "wrap",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#A0A0A0",
  },
  featureDot: {
    width: "3px",
    height: "3px",
    borderRadius: "50%",
    background: "#3A3A3A",
  },
  signInBtn: {
    width: "100%",
    padding: "14px 24px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #D4AF37, var(--accent))",
    color: "#0D0D0D",
    fontSize: "15px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    border: "none",
    cursor: "pointer",
    transition: "all 250ms ease",
  },
  btnSpinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(13, 13, 13, 0.3)",
    borderTopColor: "#0D0D0D",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },
  terms: {
    fontSize: "12px",
    color: "#666666",
    marginTop: "16px",
  },
  footer: {
    fontSize: "13px",
    color: "#666666",
    marginTop: "32px",
  },
  loadingScreen: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0D0D0D",
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "3px solid #1A1A1A",
    borderTopColor: "#D4AF37",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};
