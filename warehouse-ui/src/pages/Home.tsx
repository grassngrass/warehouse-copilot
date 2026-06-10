import { useState } from "react";
import { askQuestion } from "../services/api";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
          <h3>Generated SQL</h3>

          <pre>{response.sql}</pre>

          <h3>Result</h3>

          <pre>
            {JSON.stringify(response.result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}