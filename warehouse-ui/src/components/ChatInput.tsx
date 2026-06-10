type Props = {
  question: string;
  setQuestion: (value: string) => void;
  handleAsk: () => void;
};

export default function ChatInput({ question, setQuestion, handleAsk }: Props) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      background: "white",
      border: "1.5px solid #e5e7eb",
      borderRadius: "28px",
      padding: "8px 8px 8px 16px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    }}>
      {/* Emoji button */}
      <button style={{
        background: "none", border: "none", padding: "4px",
        color: "#9ca3af", fontSize: "20px", lineHeight: 1,
      }}>☺</button>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask Warehouse Copilot..."
        style={{
          flex: 1, border: "none", outline: "none",
          fontSize: "14px", color: "#1f2937",
          background: "transparent",
        }}
      />

      {/* Attachment button */}
      <button style={{
        background: "none", border: "none", padding: "4px",
        color: "#9ca3af", fontSize: "18px", lineHeight: 1,
      }}>⊕</button>

      {/* Send button */}
      <button
        onClick={handleAsk}
        style={{
          width: "38px", height: "38px",
          borderRadius: "50%",
          background: question.trim()
            ? "linear-gradient(135deg, #7c3aed, #2563eb)"
            : "#e5e7eb",
          border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: question.trim() ? "white" : "#9ca3af",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
  );
}
