type Props = {
  topic: string;
  barcode: string;
  onQuestionClick: (question: string) => void;
};

const questions: Record<string, string[]> = {
  "Movement Analytics": [
    "Show movement history",
    "Show previous location",
    "Show location changes",
    "Show idle bins",
    "Show stagnant bins",
  ],
  "Bin Information": [
    "Show current location",
    "Show current quantity",
    "Show material history",
    "Show full barcode details",
    "Show unused bins",
  ],
  "Audit History": [
    "Show audit history",
    "Show latest audit",
    "Show audit count",
    "Show audit timeline",
  ],
  "Inventory Analytics": [
    "Which material has highest quantity",
    "Show material history",
    "Show aging inventory",
    "Show inventory by location",
  ],
  "Employee Analytics": [
    "Which employee updated barcode",
    "Show employee audit count",
    "Show latest employee update",
    "Most active employee",
  ],
  "Purchase Analytics": [
    "Which year has maximum purchases",
    "Show purchase trends",
    "Show purchase count",
  ],
};

const barcodeQuestions = [
  "Show movement history",
  "Show previous location",
  "Show location changes",
  "Show current location",
  "Show current quantity",
  "Show material history",
  "Show full barcode details",
  "Show audit history",
  "Show latest audit",
  "Show audit count",
  "Show audit timeline",
  "Which employee updated barcode",
  "Show employee audit count",
  "Show latest employee update",
];

export default function SuggestedQuestions({ topic, barcode, onQuestionClick }: Props) {
  if (!topic) return null;

  const list = questions[topic] ?? [];

  function handleClick(q: string) {
    if (barcodeQuestions.includes(q) && barcode.trim()) {
      onQuestionClick(`${q} for barcode ${barcode}`);
    } else if (barcodeQuestions.includes(q) && !barcode.trim()) {
      alert("Please enter a barcode first.");
    } else {
      onQuestionClick(q);
    }
  }

  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    }}>
      <div style={{
        padding: "12px 16px",
        borderBottom: "1px solid #f3f4f6",
        fontSize: "13px",
        fontWeight: "600",
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}>
        {topic}
      </div>
      {list.map((q, i) => (
        <button
          key={q}
          onClick={() => handleClick(q)}
          style={{
            width: "100%",
            padding: "13px 16px",
            background: "none",
            border: "none",
            borderBottom: i < list.length - 1 ? "1px solid #f9fafb" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            fontSize: "14px",
            color: "#1f2937",
            textAlign: "left",
            transition: "background 0.1s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
          onMouseLeave={e => (e.currentTarget.style.background = "none")}
        >
          <span>{q}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      ))}
    </div>
  );
}
