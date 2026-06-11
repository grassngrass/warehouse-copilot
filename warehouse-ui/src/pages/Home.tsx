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
  { icon: "🏷️", name: "Material Analytics" },
  { icon: "📊", name: "Inventory Analytics" },
  { icon: "👤", name: "Employee Analytics" },
];

const OVERVIEW_QUESTIONS: Record<string, string> = {
  "Bin Information": "Show total bins count and which plant has most bins",
  "Audit History": "Show audit count summary",
  "Movement Analytics": "Show total movements and most moved bin",
  "Material Analytics": "Show top materials and total material count",
  "Inventory Analytics": "Show which material has highest quantity and total materials",
  "Employee Analytics": "Show most active employee and total employee updates",
};

const QUESTIONS: Record<string, string[]> = {
  "Bin Information": [
    "Show current location",
    "Show current material",
    "Show current quantity",
    "Show complete bin details",
    "Show bin status",
  ],
  "Audit History": [
    "Show total audits",
    "Show latest audits",
    "Show top audited bins",
    "Show audit trend",
  ],
  "Movement Analytics": [
    "Show latest movements",
    "Show top 10 movement trends",
    "Show top movement locations",
  ],
  "Material Analytics": [
    "Show top materials",
    "Show material distribution",
    "Show most used materials",
    "Show materials by quantity",
  ],
  "Inventory Analytics": [
    "Show total inventory quantity",
    "Show inventory by location",
    "Show highest quantity bins",
    "Show inventory distribution",
    "Show warehouse inventory summary",
  ],
  "Employee Analytics": [
    "Show most active employees",
    "Show employee leaderboard",
    "Show audit count for specific employee",
    "Show latest employee activity",
    "Show top 10 employees",
  ],
};

const FOLLOWUP_QUESTIONS: Record<string, string[]> = {
  "Bin Information": [
    "Show purchase date",
    "Show expiry date",
    "Show entry date",
    "Show audit details for this bin",
    "Show movement history for this bin",
  ],
  "Audit History": [
    "How many audits occurred on specific date?",
    "Show audit activity on specific date",
    "Which day had highest audits?",
    "Show recent audit activity",
  ],
  "Movement Analytics": [
    "Which location receives most bins?",
    "Which month had highest movement?",
    "Show bins moved on a specific date",
    
  ],
  "Material Analytics": [
    "Which material appears most frequently?",
    "Which material has highest quantity?",
    "Which material has lowest quantity?",
    "Show top 10 materials",
    "Show latest material updates",
  ],
  "Inventory Analytics": [
    "Which location stores most inventory?",
    "Which location stores least inventory?",
    "Show average quantity per bin",
    "Show low stock bins",
    "Show top stocked locations",
  ],
  "Employee Analytics": [
    "Which employee performed most audits?",
    "Which employee was most active in specific month?",
    "Show employee activity trend",
  ],
};

const DATE_PROMPT_QUESTIONS = [
  "How many audits occurred on specific date?",

    "Show audit activity on specific date",

"Show bins moved on a specific date",

"Which employee was most active in specific month?",
"Show audit count for specific employee",

  
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

      if (topic === "Bin Information") {
        setMessages(prev => [
          ...prev,
          { sender: "bot", text: overview, type: "text" },
          { sender: "bot", text: "Please enter a barcode to explore bin details:", type: "text" },
          { sender: "bot", text: "", type: "barcode-input", topic },
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { sender: "bot", text: overview, type: "text" },
          { sender: "bot", text: "", type: "suggestions", topic },
        ]);
      }
    } catch {
      if (topic === "Bin Information") {
        setMessages(prev => [
          ...prev,
          { sender: "bot", text: "Please enter a barcode to explore bin details:", type: "text" },
          { sender: "bot", text: "", type: "barcode-input", topic },
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { sender: "bot", text: "", type: "suggestions", topic },
        ]);
      }
    }

    setLoading(false);
  }

  function handleBarcodeSubmit(topic: string) {
    if (!barcode.trim()) {
      alert("Please enter a barcode first.");
      return;
    }
    setMessages(prev => [
      ...prev,
      { sender: "bot", text: "", type: "suggestions", topic },
    ]);
  }

 function handleQuestionClick(q: string, topic: string) {
  if (DATE_PROMPT_QUESTIONS.includes(q)) {
    setMessages(prev => [
      ...prev,
      { sender: "user", text: q, type: "text" },
      { sender: "bot", text: "", type: "date-input", topic, pendingQuestion: q },
    ]);
    return;
  }

  // ALL Bin Information questions always use barcode (main + followup)
  if (topic === "Bin Information") {
    if (!barcode.trim()) {
      alert("Please enter a barcode first.");
      return;
    }
    handleAsk(`${q} for barcode ${barcode}`, topic);
    return;
  }

  handleAsk(q, topic);
}

  async function handleAsk(overrideQuestion?: string, topic?: string) {
    const q = (overrideQuestion ?? question).trim();
    if (!q) return;

    setRecentSearches(prev => [q, ...prev.filter(s => s !== q)].slice(0, 10));

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

      const newMessages: Message[] = [
        { sender: "bot", text: answer, type: "text" },
      ];

      if (topic && FOLLOWUP_QUESTIONS[topic]) {
        newMessages.push({
          sender: "bot",
          text: "",
          type: "followup",
          topic,
        });
      } else {
        newMessages.push(
          { sender: "bot", text: "Anything else you'd like to explore?", type: "text" },
          { sender: "bot", text: "", type: "topic-chips" }
        );
      }

      setMessages(prev => [...prev, ...newMessages]);
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

            // Topic chips
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
                      onMouseEnter={e => { e.currentTarget.style.background = "#7c3aed"; e.currentTarget.style.color = "white"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#7c3aed"; }}
                      >
                        {t.icon} {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            // Barcode input (only for Bin Information)
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
                        padding: "8px 12px", fontSize: "14px", outline: "none", color: "#1f2937",
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

            // Date input
            if (msg.type === "date-input") {
  const isEmployee = msg.pendingQuestion?.toLowerCase().includes("employee");
  const isDate = msg.pendingQuestion?.toLowerCase().includes("date") || 
                 msg.pendingQuestion?.toLowerCase().includes("month");

  const label = isEmployee
    ? "Please enter the employee name:"
    : isDate
    ? "Please specify the date, month, or year:"
    : "Please provide more details:";

  const placeholder = isEmployee
    ? "e.g. John / EMP001"
    : "e.g. today / June / 2024";

  return (
    <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "12px" }}>
      <BotAvatar />
      <div style={{
        background: "white", borderRadius: "18px 18px 18px 4px",
        padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        maxWidth: "72%",
      }}>
        <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "10px" }}>
          {label}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            placeholder={placeholder}
            id={`date-input-${i}`}
            style={{
              flex: 1, border: "1.5px solid #e5e7eb", borderRadius: "8px",
              padding: "8px 12px", fontSize: "14px", outline: "none", color: "#1f2937",
            }}
          />
          <button
            onClick={() => {
              const val = (document.getElementById(`date-input-${i}`) as HTMLInputElement)?.value;
              if (!val?.trim()) return;
              handleAsk(`${msg.pendingQuestion} for ${val}`, msg.topic);
            }}
            style={{
              padding: "8px 16px", borderRadius: "8px",
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              color: "white", border: "none", fontSize: "13px",
              fontWeight: "600", cursor: "pointer",
            }}
          >Go</button>
        </div>
      </div>
    </div>
  );
}
            // Suggested questions
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
                      <button key={q} onClick={() => handleQuestionClick(q, msg.topic!)} style={{
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

            // Follow-up questions
            if (msg.type === "followup" && msg.topic) {
  const list = FOLLOWUP_QUESTIONS[msg.topic] ?? [];
  return (
    <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "12px" }}>
      <BotAvatar />
      <div style={{
        background: "white", borderRadius: "18px 18px 18px 4px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.09)", overflow: "hidden",
        maxWidth: "72%", minWidth: "260px",
      }}>
        <div style={{
          padding: "10px 16px 8px",
          fontSize: "11px", fontWeight: "600", color: "#7c3aed",
          textTransform: "uppercase", letterSpacing: "0.08em",
          borderBottom: "1px solid #f3f4f6",
        }}>
          Related Questions You May Like
        </div>
        {list.map((q, qi) => (
          <button key={q} onClick={() => handleQuestionClick(q, msg.topic!)} style={{
            width: "100%", padding: "11px 16px",
            background: "none", border: "none",
            borderBottom: qi < list.length - 1 ? "1px solid #f3f4f6" : "none",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer", fontSize: "13.5px", color: "#1f2937", textAlign: "left",
            transition: "background 0.1s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#faf5ff")}
          onMouseLeave={e => (e.currentTarget.style.background = "none")}
          >
            <span>{q}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        ))}
        <button
          onClick={() => {
            setMessages(prev => [
              ...prev,
              { sender: "bot", text: "Of course! Go ahead and type your question below 👇", type: "text" },
            ]);
          }}
          style={{
            width: "100%", padding: "11px 16px",
            background: "none", border: "none",
            borderTop: "1px solid #f3f4f6",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: "13px",
            color: "#6b7280", fontWeight: "500",
            gap: "6px", transition: "background 0.1s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
          onMouseLeave={e => (e.currentTarget.style.background = "none")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Ask something else
        </button>
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
                {[0, 1, 2].map(j => (
                  <div key={j} style={{
                    width: "7px", height: "7px", borderRadius: "50%", background: "#7c3aed",
                    animation: "bounce 1.2s infinite",
                    animationDelay: `${j * 0.2}s`,
                  }} />
                ))}
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input bar */}
        {/* Topic switcher + Input bar */}
<div style={{ background: "white", borderTop: "1px solid #e5e7eb" }}>
  
  {/* Persistent topic chips */}
  <div style={{
    padding: "10px 24px 0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    overflowX: "auto",
    scrollbarWidth: "none",
  }}>
    <span style={{
      fontSize: "11px", color: "#9ca3af", fontWeight: "600",
      textTransform: "uppercase", letterSpacing: "0.08em",
      whiteSpace: "nowrap", flexShrink: 0,
    }}>Topics</span>
    {TOPICS.map(t => (
      <button key={t.name} onClick={() => handleTopicSelect(t.name)} style={{
        padding: "5px 12px", borderRadius: "16px",
        border: "1px solid #e5e7eb",
        background: "white", color: "#6b7280",
        cursor: "pointer", fontSize: "12px", fontWeight: "500",
        whiteSpace: "nowrap", flexShrink: 0,
        transition: "all 0.15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "#7c3aed";
        e.currentTarget.style.color = "#7c3aed";
        e.currentTarget.style.background = "#faf5ff";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "#e5e7eb";
        e.currentTarget.style.color = "#6b7280";
        e.currentTarget.style.background = "white";
      }}
      >
        {t.icon} {t.name}
      </button>
    ))}
  </div>

  <div style={{ padding: "10px 24px 16px" }}>
    <ChatInput question={question} setQuestion={setQuestion} handleAsk={() => handleAsk()} />
  </div>
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
