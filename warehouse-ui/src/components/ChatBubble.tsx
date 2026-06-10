import type { Message } from "../types/Message";

type Props = {
  message: Message;
};

export default function ChatBubble({ message }: Props) {
  const isUser = message.sender === "user";

  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      alignItems: "flex-end",
      gap: "8px",
      marginBottom: "12px",
    }}>
      {/* Bot avatar */}
      {!isUser && (
        <div style={{
          width: "32px", height: "32px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7c3aed, #2563eb)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontSize: "14px", fontWeight: "700",
          flexShrink: 0,
        }}>W</div>
      )}

      <div style={{
        background: isUser ? "linear-gradient(135deg, #7c3aed, #6d28d9)" : "white",
        color: isUser ? "white" : "#1f2937",
        padding: "12px 16px",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        maxWidth: "72%",
        fontSize: "14px",
        lineHeight: "1.55",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}>
        {message.text}
      </div>
    </div>
  );
}
