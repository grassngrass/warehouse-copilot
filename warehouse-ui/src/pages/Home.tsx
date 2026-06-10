import { useState, useRef, useEffect } from "react";
import { askQuestion } from "../services/api";
import ChatBubble from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";
import Sidebar from "../components/Sidebar";
import type { Message } from "../types/Message";

const TOPICS = [
  { icon: "📦", name: "Bin Information" },
  { icon: "📜", name: "Audit History" },
  { icon: "🔄", name: "Movement Analytics" },
  { icon: "📊", name: "Inventory Analytics" },
  { icon: "👤", name: "Employee Analytics" },
  { icon: "📈", name: "Purchase Analytics" },
];
const OVERVIEW_QUESTIONS: Record<string, string> = {
  "Bin Information": "Show total bins count and which plant has most bins",
  "Audit History": "Show total audit count and most recent audit",
  "Movement Analytics": "Show total movements and most moved bin",
  "Inventory Analytics": "Show which material has highest quantity and total materials",
  "Employee Analytics": "Show most active employee and total employee updates",
  "Purchase Analytics": "Show which year has maximum purchases and total purchase count",
};
const QUESTIONS: Record<string, string[]> = {
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

const BARCODE_QUESTIONS = [
  "Show movement history", "Show previous location", "Show location changes",
  "Show current location", "Show current quantity", "Show material history",
  "Show full barcode details", "Show audit history", "Show latest audit",
  "Show audit count", "Show audit timeline", "Which employee updated barcode",
  "Show employee audit count", "Show latest employee update",
];

export default function Home() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "👋 Hi there! I'm your Warehouse Copilot. What would you like to explore today?",
      type: "text",
    },
    {
      sender: "bot",
      text: "",
      type: "topic-chips",
    },
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleTopicSelect(topic: string) {
  const userMsg: Message = { sender: "user", text: topic, type: "text" };
  setMessages(prev => [...prev, userMsg]);
  setLoading(true);

  try {
    const data = await askQuestion(OVERVIEW_QUESTIONS[topic]);
    let overview = "";
    if (data.result?.length > 0) {
      overview = data.result
        .map((row: Record<string, unknown>) =>
          Object.entries(row)
            .map(([k, v]) => `${k}: ${String(v ?? "")}`)
            .join("\n")
        )
        .join("\n\n");
    } else {
      overview = "No overview data available.";
    }

    setMessages(prev => [
      ...prev,
      { sender: "bot", text: overview, type: "text" },
      { sender: "bot", text: "", type: "barcode-input", topic },
    ]);
  } catch {
    setMessages(prev => [
      ...prev,
      { sender: "bot", text: "", type: "barcode-input", topic },
    ]);
  }

  setLoading(false);
}

  function handleBarcodeSubmit(topic: string) {
    setMessages(prev => [
      ...prev,
      {
        sender: "bot",
        text: `Got it! Here's what I can help with for ${topic}:`,
        type: "text",
      },
      {
        sender: "bot",
        text: "",
        type: "suggestions",
        topic,
      },
    ]);
    
  }

  function handleQuestionClick(q: string) {
    let finalQ = q;
    if (BARCODE_QUESTIONS.includes(q)) {
      if (!barcode.trim()) {
        alert("Please enter a barcode first.");
        return;
      }
      finalQ = `${q} for barcode ${barcode}`;
    }
    handleAsk(finalQ);
  }

  async function handleAsk(overrideQuestion?: string) {
    const q = (overrideQuestion ?? question).trim();
    setRecentSearches(prev => [q, ...prev.filter(s => s !== q)].slice(0, 10));
    if (!q) return;

    const userMsg: Message = { sender: "user", text: q, type: "text" };
    setMessages(prev => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const data = await askQuestion(q);

      let answer = "";
      if (data.result?.length > 0) {
        answer = data.result
          .map((row: Record<string, unknown>) =>
            Object.entries(row)
              .map(([k, v]) => `${k}: ${String(v ?? "")}`)
              .join("\n")
          )
          .join("\n\n");
      } else {
        answer = "No records found for your query.";
      }

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: answer, type: "text" },
        { sender: "bot", text: "Is there anything else you'd like to explore?", type: "text" },
        { sender: "bot", text: "", type: "topic-chips" },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong. Please try again.", type: "text" },
      ]);
    }

    setLoading(false);
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f0f2f5", width: "100%" }}>
      <Sidebar recentSearches={recentSearches} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <div style={{
          padding: "14px 24px",
          background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
          display: "flex", alignItems: "center", gap: "12px",
          boxShadow: "0 2px 8px rgba(124,58,237,0.3)",
        }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            background: "rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: "700", fontSize: "16px",
          }}>W</div>
          <div>
            <div style={{ color: "white", fontWeight: "700", fontSize: "16px" }}>Warehouse Copilot</div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px" }}>Ask me anything about your warehouse</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80",
              boxShadow: "0 0 0 2px rgba(74,222,128,0.3)",
            }} />
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>Online</span>
          </div>
        </div>

        {/* Chat messages */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "20px 24px",
          display: "flex", flexDirection: "column", gap: "4px",
        }}>
          {messages.map((msg, i) => {
            // Topic chips rendered inside chat
            if (msg.type === "topic-chips") {
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "12px" }}>
                  <BotAvatar />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxWidth: "75%" }}>
                    {TOPICS.map(t => (
                      <button key={t.name} onClick={() => handleTopicSelect(t.name)} style={{
                        padding: "9px 16px", borderRadius: "22px",
                        border: "1.5px solid #7c3aed",
                        background: "white", color: "#7c3aed",
                        cursor: "pointer", fontSize: "13px", fontWeight: "500",
                        transition: "all 0.15s",
                        boxShadow: "0 1px 4px rgba(124,58,237,0.1)",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "#7c3aed";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "white";
                        e.currentTarget.style.color = "#7c3aed";
                      }}
                      >
                        {t.icon} {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            // Barcode input rendered inside chat
            if (msg.type === "barcode-input") {
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "12px" }}>
                  <BotAvatar />
                  <div style={{
                    background: "white", borderRadius: "18px 18px 18px 4px",
                    padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    maxWidth: "72%", display: "flex", gap: "8px",
                  }}>
                    <input
                      type="text"
                      placeholder="Enter barcode..."
                      value={barcode}
                      onChange={e => setBarcode(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleBarcodeSubmit(msg.topic!); }}
                      style={{
                        flex: 1, border: "1.5px solid #e5e7eb", borderRadius: "8px",
                        padding: "8px 12px", fontSize: "14px", outline: "none",
                        color: "#1f2937",
                      }}
                    />
                    <button onClick={() => handleBarcodeSubmit(msg.topic!)} style={{
                      padding: "8px 16px", borderRadius: "8px",
                      background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                      color: "white", border: "none", fontSize: "13px",
                      fontWeight: "600", cursor: "pointer",
                    }}>OK</button>
                  </div>
                </div>
              );
            }

            // Suggested questions rendered inside chat
            if (msg.type === "suggestions" && msg.topic) {
              const list = QUESTIONS[msg.topic] ?? [];
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "12px" }}>
                  <BotAvatar />
                  <div style={{
                    background: "white", borderRadius: "18px 18px 18px 4px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.09)", overflow: "hidden",
                    maxWidth: "72%", minWidth: "260px",
                  }}>
                    {list.map((q, qi) => (
                      <button key={q} onClick={() => handleQuestionClick(q)} style={{
                        width: "100%", padding: "12px 16px",
                        background: "none", border: "none",
                        borderBottom: qi < list.length - 1 ? "1px solid #f3f4f6" : "none",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        cursor: "pointer", fontSize: "14px", color: "#1f2937", textAlign: "left",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#faf5ff")}
                      onMouseLeave={e => (e.currentTarget.style.background = "none")}
                      >
                        <span>{q}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            // Normal text bubble
            return <ChatBubble key={i} message={msg} />;
          })}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "12px" }}>
              <BotAvatar />
              <div style={{
                background: "white", padding: "12px 18px",
                borderRadius: "18px 18px 18px 4px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                display: "flex", gap: "5px", alignItems: "center",
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: "7px", height: "7px", borderRadius: "50%", background: "#7c3aed",
                    animation: "bounce 1.2s infinite",
                    animationDelay: `${i * 0.2}s`,
                  }} />
                ))}
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input bar only */}
        <div style={{
          padding: "12px 24px 16px", background: "white",
          borderTop: "1px solid #e5e7eb",
        }}>
          <ChatInput question={question} setQuestion={setQuestion} handleAsk={() => handleAsk()} />
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

function BotAvatar() {
  return (
    <div style={{
      width: "32px", height: "32px", borderRadius: "50%",
      background: "linear-gradient(135deg, #7c3aed, #2563eb)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "white", fontWeight: "700", fontSize: "14px", flexShrink: 0,
    }}>W</div>
  );
}
