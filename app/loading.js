export default function Loading() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#000000",
    }}>
      <div style={{
        width: "32px",
        height: "32px",
        border: "3px solid #161616",
        borderTopColor: "#D4AF37",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
