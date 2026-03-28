import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata = {
  title: "CodeReview AI — Write Better Code. Instantly.",
  description:
    "AI-powered code review tool that analyzes, improves, and perfects your code. Get instant bug detection, performance suggestions, security scans, and AI-generated documentation.",
  keywords: "code review, AI, code analysis, bug detection, code quality",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: "toast-custom",
                duration: 3000,
                style: {
                  background: "#1A1A1A",
                  color: "#F5F5F5",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontSize: "14px",
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
