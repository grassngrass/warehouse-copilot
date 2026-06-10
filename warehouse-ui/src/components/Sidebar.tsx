const recentSearches = [
  "Show unused bins",
  "Show movement history",
  "Show material history",
  "Show audit count",
];

export default function Sidebar() {
  return (
    <div style={{
      width: "220px",
      background: "white",
      borderRight: "1px solid #e5e7eb",
      display: "flex",
      flexDirection: "column",
      padding: "20px 0",
    }}>
      {/* Logo area */}
      <div style={{
        padding: "0 20px 20px",
        borderBottom: "1px solid #f3f4f6",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}>
          <div style={{
            width: "32px", height: "32px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: "700", fontSize: "14px",
          }}>W</div>
          <span style={{ fontWeight: "700", fontSize: "15px", color: "#1f2937" }}>Warehouse AI</span>
        </div>
      </div>

      {/* Recent searches */}
      <div style={{ padding: "16px 20px" }}>
        <p style={{
          fontSize: "11px", fontWeight: "600", color: "#9ca3af",
          textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px",
        }}>Recent</p>
        {recentSearches.map((item) => (
          <div key={item} style={{
            padding: "8px 10px",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#374151",
            marginBottom: "2px",
            cursor: "pointer",
            transition: "background 0.1s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
