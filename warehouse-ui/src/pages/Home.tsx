import { useState } from "react";
import { askQuestion } from "../services/api";
import TopicCards from "../components/TopicCards";
import SuggestedQuestions from "../components/SuggestedQuestions";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  async function handleAsk() {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const data = await askQuestion(question);
      setResponse(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Warehouse Copilot</h1>

<TopicCards
  onSelect={(topic) => setSelectedTopic(topic)}
/>

{selectedTopic && (
  <div style={{ marginBottom: "20px" }}>
    <input
      type="text"
      placeholder="Enter Barcode (optional)"
      value={barcode}
      onChange={(e) => setBarcode(e.target.value)}
      style={{
        width: "300px",
        padding: "10px",
      }}
    />
  </div>
)}

<SuggestedQuestions
  topic={selectedTopic}
  barcode={barcode}
  onQuestionClick={(q) => setQuestion(q)}
/>

<input
  type="text"
  placeholder="Ask a warehouse question..."
  value={question}
  onChange={(e) => setQuestion(e.target.value)}
  style={{
    width: "500px",
    padding: "10px",
    marginRight: "10px",
  }}
/>

      <button onClick={handleAsk}>
        Ask
      </button>

      {loading && <p>Loading...</p>}

      {response && (
        <div style={{ marginTop: "20px" }}>
          
          <div
  style={{
    background: "#111827",
    padding: "15px",
    borderRadius: "10px",
    marginTop: "20px",
  }}
>
  {response.result.map((row: any, index: number) => (
    <div key={index}>
      {Object.entries(row).map(([key, value]) => (
        <p key={key}>
          <strong>{key}:</strong> {String(value)}
        </p>
      ))}
    </div>
  ))}
</div>
        </div>
      )}
    </div>
  );
}